import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();
  const username = user?.username;
  if (userId && username) {
    return redirect(`/dashboard/${username}`);
  }
  return redirect("/sign-in");
}
