import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const priceMonthly = process.env.STRIPE_PRICE_MONTHLY;
    const priceYearly = process.env.STRIPE_PRICE_YEARLY;

    if (!process.env.STRIPE_SECRET_KEY || !priceMonthly || !priceYearly) {
      return NextResponse.json(
        { error: "Billing is not configured yet. Please try again later." },
        { status: 501 },
      );
    }

    const body = await request.json();
    const cycle: "monthly" | "annual" =
      body.cycle === "monthly" ? "monthly" : "annual";

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Prevent double subscription: block if already premium. Checked live
    // from Clerk's Backend API so stale session JWT claims don't matter.
    const role = user.publicMetadata?.role;
    if (role === "premium" || role === "admin") {
      return NextResponse.json(
        { error: "You're already on Pro." },
        { status: 409 },
      );
    }

    // Also guard the webhook lag window: block if the user already has an
    // active subscription in Stripe but the role hasn't flipped yet.
    const email = user.emailAddresses?.[0]?.emailAddress;
    if (email) {
      const customers = await stripe.customers.list({ email, limit: 1 });
      const customer = customers.data[0];
      if (customer) {
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          status: "active",
          limit: 1,
        });
        if (subscriptions.data.length > 0) {
          return NextResponse.json(
            { error: "You already have an active Pro subscription." },
            { status: 409 },
          );
        }
      }
    }

    let session;
    if (cycle == "annual") {
      session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: priceYearly!, quantity: 1 }],
        client_reference_id: userId,
        customer_email: user.emailAddresses?.[0]?.emailAddress || undefined,
        metadata: { userId, cycle },
        subscription_data: { metadata: { userId, cycle } },
        success_url: `${appUrl}/dashboard/me?upgraded=1`,
        cancel_url: `${appUrl}/#pricing`,
      });
    } else {
      session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: priceMonthly, quantity: 1 }],
        client_reference_id: userId,
        customer_email: user.emailAddresses?.[0]?.emailAddress || undefined,
        metadata: { userId, cycle },
        subscription_data: { metadata: { userId, cycle } },
        success_url: `${appUrl}/dashboard/me?upgraded=1`,
        cancel_url: `${appUrl}/#pricing`,
      });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to start checkout. Please try again.",
      },
      { status: 500 },
    );
  }
}
