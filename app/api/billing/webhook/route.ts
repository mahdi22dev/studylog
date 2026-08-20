import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";

type MetadataPatch = {
  publicMetadata?: Record<string, unknown>;
  privateMetadata?: Record<string, unknown>;
};

// Clerk's updateUser replaces the metadata objects it's given, so we read the
// current user first and merge top-level keys to avoid wiping existing data.
async function applyMetadata(userId: string, patch: MetadataPatch) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  await client.users.updateUser(userId, {
    publicMetadata: {
      ...(user.publicMetadata as Record<string, unknown>),
      ...(patch.publicMetadata ?? {}),
    },
    privateMetadata: {
      ...(user.privateMetadata as Record<string, unknown>),
      ...(patch.privateMetadata ?? {}),
    },
  });
}

export async function GET(request: Request) {
  return NextResponse.json({ received: true });
}

export async function POST(request: Request) {
  console.log("webhook recived");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    const payload = await request.text();
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;
      if (session.mode === "subscription") {
        const userId = session.metadata?.userId;
        if (!userId) {
          return NextResponse.json({ received: true });
        }

        const subscriptionId = session.subscription as string | undefined;
        const subscription = subscriptionId
          ? ((await stripe.subscriptions.retrieve(
              subscriptionId
            )) as unknown as Stripe.Subscription)
          : null;

        const plan = session.metadata?.cycle === "monthly" ? "monthly" : "annual";
        const subscriptionEndsAt = subscription?.items.data[0]
          ?.current_period_end
          ? new Date(
              subscription.items.data[0].current_period_end * 1000
            ).toISOString()
          : undefined;

        await applyMetadata(userId, {
          publicMetadata: {
            role: "premium",
            plan,
            planActive: true,
            subscriptionEndsAt: subscriptionEndsAt ?? null,
          },
          privateMetadata: {
            stripeCustomerId:
              (typeof session.customer === "string"
                ? session.customer
                : session.customer?.id) ?? null,
            stripeSubscriptionId: subscriptionId ?? null,
          },
        });
      }
    } catch (err) {
      console.error("Failed to grant premium role:", err);
      return NextResponse.json(
        { error: "Failed to grant premium role" },
        { status: 500 },
      );
    }
  }

  if (event.type === "customer.subscription.deleted") {
    try {
      const subscription = event.data.object;
      const userId = subscription.metadata?.userId;
      if (userId) {
        await applyMetadata(userId, {
          publicMetadata: {
            role: "free",
            planActive: false,
            subscriptionEndsAt: null,
          },
        });
      }
    } catch (err) {
      console.error("Failed to revoke premium role:", err);
      return NextResponse.json(
        { error: "Failed to revoke premium role" },
        { status: 500 },
      );
    }
  }

  if (event.type === "customer.subscription.updated") {
    try {
      const subscription = event.data.object;
      const userId = subscription.metadata?.userId;
      if (!userId) return NextResponse.json({ received: true });

      const status = subscription.status;
      const periodEnd = subscription.items.data[0]?.current_period_end;

      // Renewal (or any other lifecycle change): keep the plan live while the
      // subscription is active/trialing and refresh the period end.
      await applyMetadata(userId, {
        publicMetadata: {
          planActive: status === "active" || status === "trialing",
          subscriptionEndsAt: periodEnd
            ? new Date(periodEnd * 1000).toISOString()
            : null,
        },
      });
    } catch (err) {
      console.error("Failed to sync subscription details:", err);
      return NextResponse.json(
        { error: "Failed to sync subscription details" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}