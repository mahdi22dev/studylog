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
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent border border-border/50 mb-4 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-secondary" />
          <span className="text-xs font-bold text-secondary uppercase tracking-widest">
            Features
          </span>
        </div>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
          Powerful Features
        </h2>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          Everything you need to build effective study habits and track your
          learning progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`bg-muted/90 backdrop-blur-xl border border-border rounded-2xl p-6 transition-all duration-300 group relative overflow-hidden cursor-default hover:-translate-y-1.5 hover:border-primary/60 hover:bg-accent hover:shadow-2xl hover:shadow-primary/20 ${
              hoveredFeature === index ? "glow-active border-primary/60" : ""
            }`}
            onMouseEnter={() => setHoveredFeature(index)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            {feature.pro && (
              <div className="absolute top-4 right-4 bg-success/20 text-success px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Pro
              </div>
            )}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                feature.pro
                  ? "bg-accent group-hover:bg-success/20 group-hover:scale-110"
                  : "bg-accent group-hover:bg-primary/25 group-hover:scale-110"
              }`}
            >
              <feature.icon
                className={`h-5 w-5 transition-transform duration-300 ${
                  feature.pro ? "text-success" : "text-secondary"
                }`}
              />
            </div>
            <h3 className="font-heading text-xl font-semibold tracking-[-0.01em] mb-2 text-white group-hover:text-secondary transition-colors">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
