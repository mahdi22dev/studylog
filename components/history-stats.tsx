"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ColumnDef } from "@/components/ui/shadcn-io/table";
import {
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHead,
  TableHeader,
  TableHeaderGroup,
  TableProvider,
  TableRow,
} from "@/components/ui/shadcn-io/table";
import { Clock, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { StudySession } from "@prisma/client";
import { formatTime } from "@/lib/utils";

interface DayStudyData {
  id: string;
  date: Date;
  sessions: number;
  totalMinutes: number;
  averageSessionMinutes: number;
}

const StudyHistory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [studyData, setStudyData] = useState<DayStudyData[]>([]);

  const ListOfDays = useRef(new Map<string, StudySession[]>());

  const getAvarageSessions = async () => {
    try {
      console.log("fetching average");
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setIsLoading(true);
      const response = await fetch(
        `api/avarge?timezone=${encodeURIComponent(timezone)}`
      );

      if (!response.ok) {
        toast.error(`Unable to load study sessions. Please try again later.`);
        return;
      }

      const data = (await response.json()) as { message: StudySession[] };

      // Initialize the map with last 7 days
      ListOfDays.current.clear();
      const weekData: DayStudyData[] = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const dateKey = date.toDateString();
        console.log(dateKey, "datekey");

        ListOfDays.current.set(dateKey, []);
      }

      // Group sessions by date
      data?.message.forEach((session) => {
        const sessionDate = new Date(session.startTime);
        sessionDate.setHours(0, 0, 0, 0);
        const dateKey = sessionDate.toDateString();

        if (ListOfDays.current.has(dateKey)) {
          ListOfDays.current.get(dateKey)!.push(session);
        }
      });

      // Convert map to DayStudyData array
      ListOfDays.current.forEach((sessions, dateKey) => {
        console.log("sessions ", dateKey);

        const date = new Date(dateKey);
        const totalMinutes = sessions.reduce(
          (sum, session) => sum + (session.durationMin || 0),
          0
        );
        const sessionCount = sessions.length;
        const averageSessionMinutes =
          sessionCount > 0 ? Math.floor(totalMinutes / sessionCount) : 0;

        weekData.push({
          id: dateKey,
          date,
          sessions: sessionCount,
          totalMinutes,
          averageSessionMinutes,
        });
      });

      // Sort by date (most recent first)
      weekData.sort((a, b) => b.date.getTime() - a.date.getTime());
      setStudyData(weekData);

      console.log("Processed week data:", weekData);
    } catch (error) {
      console.error("Error fetching average sessions:", error);
      toast.error(
        "Network error while fetching study sessions. Check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAvarageSessions();
  }, []);

  // Calculate overall statistics
  const totalSessions = studyData.reduce((sum, day) => sum + day.sessions, 0);
  const totalMinutes = studyData.reduce(
    (sum, day) => sum + day.totalMinutes,
    0
  );
  const averageHoursPerDay =
    studyData.length > 0
      ? (totalMinutes / 60 / studyData.length).toFixed(1)
      : "0.0";
  const averageSessionMinutes =
    totalSessions > 0 ? Math.floor(totalMinutes / totalSessions) : 0;

  // Calculate average minutes per day for comparison
  const averageMinutesPerDay =
    studyData.length > 0 ? totalMinutes / studyData.length : 0;

  const columns: ColumnDef<DayStudyData>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.date);
        const isToday = date.toDateString() === new Date().toDateString();
        const isYesterday =
          date.toDateString() ===
          new Date(Date.now() - 86400000).toDateString();

        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="font-medium">
                {isToday
                  ? "Today"
                  : isYesterday
                  ? "Yesterday"
                  : date.toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
              </span>
              <div className="text-xs text-muted-foreground">
                {date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "sessions",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Sessions" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold">{row.original.sessions}</div>
          <span className="text-xs text-muted-foreground">sessions</span>
        </div>
      ),
    },
    {
      accessorKey: "totalMinutes",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Total Time" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {formatTime(row.original.totalMinutes)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "averageSessionMinutes",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Avg Session" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {formatTime(row.original.averageSessionMinutes)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "comparison",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="vs Average" />
      ),
      cell: ({ row }) => {
        const dayMinutes = row.original.totalMinutes;
        const diff = dayMinutes - averageMinutesPerDay;
        const percentChange =
          averageMinutesPerDay > 0
            ? ((diff / averageMinutesPerDay) * 100).toFixed(0)
            : "0";

        const isPositive = diff > 0;
        const isNeutral = diff === 0;

        return (
          <div className="flex items-center gap-2">
            {isNeutral ? (
              <span className="text-sm text-muted-foreground">—</span>
            ) : (
              <span
                className={`text-sm font-medium ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositive ? "+" : ""}
                {percentChange}%
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "dayOverDay",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="vs Previous Day" />
      ),
      cell: ({ row }) => {
        const currentIndex = studyData.findIndex(
          (day) => day.id === row.original.id
        );

        // Last day in the list has no previous day to compare
        if (currentIndex === studyData.length - 1) {
          return (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">—</span>
            </div>
          );
        }

        const previousDay = studyData[currentIndex + 1];
        const currentMinutes = row.original.totalMinutes;
        const previousMinutes = previousDay.totalMinutes;

        const diff = currentMinutes - previousMinutes;

        // Handle special cases
        let percentChange: string;
        if (previousMinutes === 0 && currentMinutes === 0) {
          percentChange = "0";
        } else if (previousMinutes === 0 && currentMinutes > 0) {
          percentChange = "100";
        } else if (currentMinutes === 0 && previousMinutes > 0) {
          percentChange = "-100";
        } else {
          percentChange = ((diff / previousMinutes) * 100).toFixed(0);
        }

        const isPositive = diff > 0;
        const isNeutral = diff === 0;

        return (
          <div className="flex items-center gap-2">
            {isNeutral ? (
              <span className="text-sm text-muted-foreground">—</span>
            ) : (
              <div className="flex items-center gap-1">
                <span
                  className={`text-sm font-medium ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {percentChange}%
                </span>
                <span className="text-xs text-muted-foreground">
                  ({isPositive ? "+" : ""}
                  {formatTime(Math.abs(diff))})
                </span>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-b-transparent animate-spin"></div>
        </div>
        <div className="text-lg font-medium animate-pulse">
          Loading study history...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Hours/Day
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageHoursPerDay}h</div>
            <p className="text-xs text-muted-foreground">
              Over the last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Session Length
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(averageSessionMinutes)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {totalSessions} sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Study Time
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(totalMinutes)}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days combined
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Study History - Last 7 Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TableProvider columns={columns} data={studyData}>
            <TableHeader>
              {({ headerGroup }) => (
                <TableHeaderGroup
                  headerGroup={headerGroup}
                  key={headerGroup.id}
                >
                  {({ header }) => (
                    <TableHead header={header} key={header.id} />
                  )}
                </TableHeaderGroup>
              )}
            </TableHeader>
            <TableBody>
              {({ row }) => (
                <TableRow key={row.id} row={row}>
                  {({ cell }) => <TableCell cell={cell} key={cell.id} />}
                </TableRow>
              )}
            </TableBody>
          </TableProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyHistory;
