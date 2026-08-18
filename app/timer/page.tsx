import { redirect } from "next/navigation";

export default function TimerRedirectPage() {
  redirect("/dashboard/timer");
}
