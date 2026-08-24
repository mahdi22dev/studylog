import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
    >
      <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center glow-primary">
        <div className="w-3.5 h-3.5 rounded-full bg-primary-foreground/20 border-2 border-primary-foreground flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
        </div>
      </div>
      <span className="text-lg font-bold text-foreground font-sora tracking-tight">
        Focurio
      </span>
    </Link>
  );
}
