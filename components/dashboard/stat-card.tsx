import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon?: LucideIcon;
  accentColor?: "purple" | "green" | "default";
  className?: string;
}

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  accentColor = "default",
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "bg-[#0D1117] border border-white/5 rounded-2xl shadow-none",
        className
      )}
    >
      <CardContent className="p-5 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
            {label}
          </span>
          {Icon && (
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg",
                accentColor === "purple" && "bg-[#7C5CFF]/15",
                accentColor === "green" && "bg-[#38dfab]/15",
                accentColor === "default" && "bg-white/[0.06]"
              )}
            >
              <Icon
                className={cn(
                  "h-3.5 w-3.5",
                  accentColor === "purple" && "text-[#7C5CFF]",
                  accentColor === "green" && "text-[#38dfab]",
                  accentColor === "default" && "text-white/50"
                )}
              />
            </div>
          )}
        </div>
        <span
          className={cn(
            "text-2xl font-bold tracking-tight",
            accentColor === "purple" && "text-[#7C5CFF]",
            accentColor === "green" && "text-[#38dfab]",
            accentColor === "default" && "text-white"
          )}
        >
          {value}
        </span>
        {subtext && (
          <span className="text-[11px] text-white/30 font-medium">
            {subtext}
          </span>
        )}
      </CardContent>
    </Card>
  );
}
