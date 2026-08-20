import "dotenv/config";

const BASE = "https://api.clerk.com/v1";

async function request(path: string, init?: RequestInit) {
  const res = await fetch(BASE + path, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  return res.json();
}

async function main() {
  const [identifier, role] = process.argv.slice(2);
  if (!identifier) {
    console.error(
      "Usage: tsx db/set-role.ts <username|email> [premium|free|admin]"
    );
    process.exit(1);
  }
  if (!process.env.CLERK_SECRET_KEY) {
    console.error("CLERK_SECRET_KEY is not set in .env");
    process.exit(1);
  }

  const query = identifier.includes("@")
    ? `email_address=${encodeURIComponent(identifier)}`
    : `username=${encodeURIComponent(identifier)}`;

  const list = (await request(`/users?${query}`)) as Array<Record<string, any>>;
  const user = list[0];
  if (!user) {
    console.error(`No user found for "${identifier}"`);
    process.exit(1);
  }

  console.log(
    "User:",
    user.id,
    "|",
    user.username ?? "",
    "|",
    user.email_addresses?.[0]?.email_address ?? ""
  );
  console.log(
    "Current public_metadata:",
    JSON.stringify(user.public_metadata ?? {})
  );

  if (role) {
    const valid = ["free", "premium", "admin"];
    if (!valid.includes(role)) {
      console.error(`Invalid role '${role}'. Must be one of: ${valid.join(", ")}`);
      process.exit(1);
    }
    const updated = (await request(`/users/${user.id}`, {
      method: "PATCH",
      body: JSON.stringify({ public_metadata: { role } }),
    })) as Record<string, any>;
    console.log(
      "Updated public_metadata:",
      JSON.stringify(updated.public_metadata ?? {})
    );
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});