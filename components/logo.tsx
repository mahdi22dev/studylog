import { Brain } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
    >
      <div className="p-1 rounded-lg bg-[#6c47ff]/10 border border-[#6c47ff]/20 flex items-center justify-center">
        <Brain className="w-5 h-5 text-[#c9beff] fill-[#c9beff]/20" />
      </div>
      <span className="font-heading text-xl font-bold tracking-tight text-[#c9beff]">
        Focurio
      </span>
    </Link>
  );
}
