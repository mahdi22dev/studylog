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
        "bg-card border border-border rounded-2xl shadow-none",
        className
      )}
    >
      <CardContent className="p-5 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
          {Icon && (
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg",
                accentColor === "purple" && "bg-primary/15",
                accentColor === "green" && "bg-success/15",
                accentColor === "default" && "bg-muted/50"
              )}
            >
              <Icon
                className={cn(
                  "h-3.5 w-3.5",
                  accentColor === "purple" && "text-primary",
                  accentColor === "green" && "text-success",
                  accentColor === "default" && "text-muted-foreground"
                )}
              />
            </div>
          )}
        </div>
        <span
          className={cn(
            "text-2xl font-bold tracking-tight",
            accentColor === "purple" && "text-primary",
            accentColor === "green" && "text-success",
            accentColor === "default" && "text-card-foreground"
          )}
        >
          {value}
        </span>
        {subtext && (
          <span className="text-[11px] text-muted-foreground/70 font-medium">
            {subtext}
          </span>
        )}
      </CardContent>
    </Card>
  );
}