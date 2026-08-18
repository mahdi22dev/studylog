import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import StudyLog from "@/app/timer/page";

export default async function DashboardUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  const { id } = await params;

  // 1. Redirect unauthenticated visitors to sign in
  if (!userId) {
    redirect("/sign-in");
  }

  // 2. Protect route against URL ID spoofing: redirect to current user's own dashboard if IDs mismatch
  if (userId !== id) {
    redirect(`/dashboard/${userId}`);
  }

  return <StudyLog />;
}
