"use client";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import StudyHistory from "@/components/history-stats";

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Container */}
      <div className="flex-1 md:ml-64 flex flex-col relative min-h-screen">
        <DashboardTopbar />

        <main className="flex-1 pt-24 px-6 md:px-10 pb-10">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Title */}
            <div>
              <h1 className="text-3xl font-extrabold text-white font-sora tracking-tight">
                Study Analytics
              </h1>
              <p className="text-xs md:text-sm text-white/50 mt-1 font-medium">
                Detailed breakdown of your study performance, averages, and session logs.
              </p>
            </div>

            <StudyHistory />
          </div>
        </main>
      </div>
    </div>
  );
}
