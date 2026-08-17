"use client";

import { useState } from "react";
import {
  Timer,
  BarChart3,
  FileText,
  Target,
  Sparkles,
  Bell,
} from "lucide-react";

export function Features() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Timer,
      title: "Pomodoro Timer",
      description:
        "Customizable focus sessions with automatic break reminders to keep you in the zone.",
      pro: false,
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description:
        "Real-time study time tracking with detailed statistics and visual charts.",
      pro: false,
    },
    {
      icon: FileText,
      title: "Session Notes",
      description:
        "Organize notes into groups with a powerful, distraction-free markdown editor.",
      pro: false,
    },
    {
      icon: Target,
      title: "Goal Setting",
      description:
        "Set weekly study targets and track your progress towards mastering subjects.",
      pro: false,
    },
    {
      icon: Sparkles,
      title: "Weekly Summaries",
      description:
        "AI-generated summaries of your week's focus sessions and learning milestones.",
      pro: true,
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description:
        "Intelligent nudge system based on your historical peak productivity hours.",
      pro: true,
    },
  ];

  return (
    <section id="features" className="max-w-[1200px] mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h2 className="font-heading text-2xl font-bold tracking-[-0.02em] mb-4">
          Powerful Features
        </h2>
        <p className="text-base text-[#c9c3d9] max-w-2xl mx-auto">
          Everything you need to build effective study habits and track your
          learning progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`glass-card rounded-xl p-6 transition-all duration-300 group relative overflow-hidden cursor-default ${
              hoveredFeature === index ? "glow-active" : ""
            }`}
            onMouseEnter={() => setHoveredFeature(index)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            {feature.pro && (
              <div className="absolute top-4 right-4 bg-[#38dfab]/20 text-[#38dfab] px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                Pro
              </div>
            )}
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                feature.pro
                  ? "bg-[#1d1f27] group-hover:bg-[#38dfab]/10"
                  : "bg-[#1d1f27] group-hover:bg-[#6c47ff]/10"
              }`}
            >
              <feature.icon
                className={`h-5 w-5 ${
                  feature.pro ? "text-[#38dfab]" : "text-[#c9beff]"
                }`}
              />
            </div>
            <h3 className="font-heading text-xl font-semibold tracking-[-0.01em] mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-[#c9c3d9] leading-5">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
