"use client";
import { useMemo } from "react";
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

interface DayStudyData {
  id: string;
  date: Date;
  sessions: number;
  totalMinutes: number;
  averageSessionMinutes: number;
}

// Generate random study data for the last 7 days
const generateStudyData = (): DayStudyData[] => {
  const data: DayStudyData[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const sessions = Math.floor(Math.random() * 8) + 1; // 1-8 sessions
    const totalMinutes = Math.floor(Math.random() * 300) + 60; // 60-360 minutes
    const averageSessionMinutes = Math.floor(totalMinutes / sessions);

    data.push({
      id: `day-${i}`,
      date,
      sessions,
      totalMinutes,
      averageSessionMinutes,
    });
  }

  return data;
};

const StudyHistory = () => {
  const studyData = useMemo(() => generateStudyData(), []);

  // Calculate overall statistics
  const totalSessions = studyData.reduce((sum, day) => sum + day.sessions, 0);
  const totalMinutes = studyData.reduce(
    (sum, day) => sum + day.totalMinutes,
    0
  );
  const averageHoursPerDay = (totalMinutes / 60 / 7).toFixed(1);
  const averageSessionMinutes = Math.floor(totalMinutes / totalSessions);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

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
  ];

  return (
    <div className="space-y-6 mt-5">
      {" "}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
