"use client";

import { PieChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { SubjectDistributionItem } from "@/lib/types";

interface SubjectDistributionProps {
  items: SubjectDistributionItem[];
  totalHoursStr: string;
  isLoading?: boolean;
}

export function SubjectDistribution({
  items,
  totalHoursStr,
  isLoading = false,
}: SubjectDistributionProps) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-40 rounded" />
          </div>
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <div className="flex justify-center mb-8">
          <Skeleton className="h-40 w-40 rounded-full" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
              <Skeleton className="h-4 w-16 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-card-foreground font-sora flex items-center gap-2">
          <PieChart className="h-5 w-5 text-success" />
          Subject Distribution
        </h3>
        <span className="text-[10px] font-semibold text-success bg-success/10 px-2.5 py-1 rounded-full border border-success/20">
          Recent & All-Time
        </span>
      </div>

      <div className="flex justify-center mb-8 relative">
        <svg
          className="transform -rotate-90"
          height="160"
          viewBox="0 0 160 160"
          width="160"
        >
          <circle
            cx="80"
            cy="80"
            fill="transparent"
            r="70"
            stroke="hsl(var(--muted))"
            strokeWidth="20"
          />
          {items.map((sub, idx) => {
            const prevPct = items.slice(0, idx).reduce((acc, curr) => acc + curr.pct, 0);
            return (
              <circle
                key={sub.name}
                cx="80"
                cy="80"
                fill="transparent"
                r="70"
                stroke={sub.color}
                strokeDasharray="439.8"
                strokeDashoffset={439.8 - (439.8 * sub.pct) / 100}
                strokeWidth="20"
                style={{
                  transform: `rotate(${(prevPct / 100) * 360}deg)`,
                  transformOrigin: "center",
                }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center font-sora">
          <span className="text-2xl font-extrabold text-card-foreground">{totalHoursStr}</span>
          <span className="text-xs text-muted-foreground">All Time</span>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        {items.map((sub) => (
          <div key={sub.name} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: sub.color }}
              />
              <span className="text-card-foreground">{sub.name}</span>
            </div>
            <span className="text-muted-foreground font-medium">
              {sub.pct}% ({sub.hoursStr})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

