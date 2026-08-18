import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import StudyLog from "@/app/timer/page";

export default async function DashboardUserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { userId } = await auth();

  // 1. Unauthenticated visitors redirect to sign in
  if (!userId) {
    redirect("/sign-in");
  }

  // 2. Fetch current user details from Clerk
  const user = await currentUser();
  const userSlug =
    user?.username ||
    user?.firstName?.toLowerCase().replace(/\s+/g, "") ||
    userId;

  const { username } = await params;
  const decodedParam = decodeURIComponent(username);

  // 3. Normalize & protect route: redirect /dashboard/me or mismatched URLs to clean handle /dashboard/[username]
  if (decodedParam !== userSlug) {
    redirect(`/dashboard/${encodeURIComponent(userSlug)}`);
  }
  return <StudyLog />;
}
