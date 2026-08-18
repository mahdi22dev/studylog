import { Timer } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
    >
      <Timer className="h-6 w-6 text-[#c9beff]" />
      <span className="font-heading text-xl font-bold text-[#c9beff]">
        Focurio
      </span>
    </Link>
  );
}
