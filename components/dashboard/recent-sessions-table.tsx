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
import { Skeleton } from "@/components/ui/skeleton";
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
    <Card className="bg-card border border-border rounded-2xl shadow-none">
      <CardHeader className="px-5 pt-5 pb-3 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-semibold text-card-foreground">
            Recent Sessions
          </CardTitle>
        </div>
        <Link
          href="/dashboard/timer"
          className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-14 rounded" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : workSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground/50">
            <BookOpen className="h-8 w-8 opacity-30" />
            <p className="text-sm">No sessions yet — start your first focus session!</p>
          </div>
        ) : (
          <ScrollArea className="max-h-80">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs text-muted-foreground/60 font-medium uppercase tracking-wider pl-5">
                    Date
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground/60 font-medium uppercase tracking-wider">
                    Duration
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground/60 font-medium uppercase tracking-wider">
                    Subject
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground/60 font-medium uppercase tracking-wider pr-5">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workSessions.map((session) => (
                  <TableRow
                    key={session.id}
                    className="border-border/40 hover:bg-accent/50 transition-colors"
                  >
                    <TableCell className="pl-5 py-3 text-xs text-muted-foreground">
                      {formatSessionDate(session.startTime)}
                    </TableCell>
                    <TableCell className="py-3 text-sm font-medium text-card-foreground">
                      {formatDuration(session.durationMin)}
                    </TableCell>
                    <TableCell className="py-3">
                      {session.subject ? (
                        <span className="text-sm font-medium text-primary">
                          {session.subject}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground/50 italic">—</span>
                      )}
                    </TableCell>
                    <TableCell className="py-3 pr-5">
                      {session.completed ? (
                        <Badge className="bg-success/10 text-success border border-success/20 text-[10px] font-medium px-2 py-0.5 rounded-full">
                          Completed
                        </Badge>
                      ) : (
                        <Badge className="bg-destructive/10 text-destructive border border-destructive/20 text-[10px] font-medium px-2 py-0.5 rounded-full">
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
