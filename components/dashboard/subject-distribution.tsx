"use client";

import { PieChart } from "lucide-react";
import type { SubjectDistributionItem } from "@/lib/types";

interface SubjectDistributionProps {
  items: SubjectDistributionItem[];
  totalHoursStr: string;
}

export function SubjectDistribution({
  items,
  totalHoursStr,
}: SubjectDistributionProps) {
  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white font-sora flex items-center gap-2">
          <PieChart className="h-5 w-5 text-[#38dfab]" />
          Subject Distribution
        </h3>
        <span className="text-[10px] font-semibold text-[#38dfab] bg-[#38dfab]/10 px-2.5 py-1 rounded-full border border-[#38dfab]/20">
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
            stroke="#1d1f27"
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
          <span className="text-2xl font-extrabold text-white">{totalHoursStr}</span>
          <span className="text-xs text-white/40">All Time</span>
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
              <span className="text-white">{sub.name}</span>
            </div>
            <span className="text-white/40 font-medium">
              {sub.pct}% ({sub.hoursStr})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}