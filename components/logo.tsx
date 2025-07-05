import { BookOpenIcon } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center space-x-2 hover:opacity-80 transition"
    >
      <BookOpenIcon className="w-6 h-6 text-study-primary" />
      <span className="font-semibold text-xl text-study-text-primary tracking-tight">
        Study<span className="text-study-primary">Log</span>
      </span>
    </Link>
  );
}
