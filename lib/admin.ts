import { auth, clerkClient } from "@clerk/nextjs/server";

export async function isAdmin(userId: string): Promise<boolean> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return user.publicMetadata.role === "admin";
}

export async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const admin = await isAdmin(userId);
  if (!admin) {
    throw new Error("Forbidden");
  }
  return userId;
}
