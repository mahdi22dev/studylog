import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardContent from "@/components/dashboard/dashboard-content";

export default async function DashboardUserPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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

  // 3. Protect route: redirect mismatched username to canonical handle,
  //    preserving any query params (e.g. ?upgraded=1 after checkout)
  if (decodedParam !== userSlug) {
    const sp = await searchParams;
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(sp)) {
      if (value === undefined) continue;
      if (Array.isArray(value)) {
        value.forEach((item) => qs.append(key, item));
      } else {
        qs.append(key, value);
      }
    }
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    redirect(`/dashboard/${encodeURIComponent(userSlug)}${suffix}`);
  }

  return <DashboardContent />;
}
