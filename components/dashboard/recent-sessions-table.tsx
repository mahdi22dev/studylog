"use client";

import { useMemo } from "react";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import Link from "next/link";

type Session = {
  id: string;
  userId: string;
  startTime: string | Date;
  endTime: string | Date | null;
  durationMin: number;
  type: string;
  subject?: string | null;
  completed: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

interface RecentSessionsTableProps {
  sessions: Session[];
  isLoading?: boolean;
}

function formatSessionDate(date: string | Date) {
  const d = new Date(date);
  if (isToday(d)) return `Today, ${format(d, "h:mm a")}`;
  if (isYesterday(d)) return `Yesterday, ${format(d, "h:mm a")}`;
  return format(d, "MMM d, h:mm a");
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function RecentSessionsTable({
  sessions,
  isLoading = false,
}: RecentSessionsTableProps) {
  // Only show WORK sessions in the table
  const workSessions = useMemo(
    () => sessions.filter((s) => s.type === "WORK"),
    [sessions]
  );

  return (
    <Card className="bg-[#0D1117] border border-white/5 rounded-2xl shadow-none">
      <CardHeader className="px-5 pt-5 pb-3 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-white/40" />
          <CardTitle className="text-sm font-semibold text-white/80">
            Recent Sessions
          </CardTitle>
        </div>
        <Link
          href="/dashboard/timer"
          className="text-xs text-[#7C5CFF] hover:text-[#9a7eff] transition-colors font-medium"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-white/30 text-sm">
            Loading sessions…
          </div>
        ) : workSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-white/30">
            <BookOpen className="h-8 w-8 opacity-30" />
            <p className="text-sm">No sessions yet — start your first focus session!</p>
          </div>
        ) : (
          <ScrollArea className="max-h-80">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-xs text-white/30 font-medium uppercase tracking-wider pl-5">
                    Date
                  </TableHead>
                  <TableHead className="text-xs text-white/30 font-medium uppercase tracking-wider">
                    Duration
                  </TableHead>
                  <TableHead className="text-xs text-white/30 font-medium uppercase tracking-wider">
                    Subject
                  </TableHead>
                  <TableHead className="text-xs text-white/30 font-medium uppercase tracking-wider pr-5">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workSessions.map((session) => (
                  <TableRow
                    key={session.id}
                    className="border-white/[0.04] hover:bg-white/[0.025] transition-colors"
                  >
                    <TableCell className="pl-5 py-3 text-xs text-white/50">
                      {formatSessionDate(session.startTime)}
                    </TableCell>
                    <TableCell className="py-3 text-sm font-medium text-white/80">
                      {formatDuration(session.durationMin)}
                    </TableCell>
                    <TableCell className="py-3">
                      {session.subject ? (
                        <span className="text-sm font-medium text-[#7C5CFF]">
                          {session.subject}
                        </span>
                      ) : (
                        <span className="text-xs text-white/25 italic">—</span>
                      )}
                    </TableCell>
                    <TableCell className="py-3 pr-5">
                      {session.completed ? (
                        <Badge className="bg-[#38dfab]/10 text-[#38dfab] border border-[#38dfab]/20 text-[10px] font-medium px-2 py-0.5 rounded-full">
                          Completed
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-medium px-2 py-0.5 rounded-full">
                          Interrupted
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
