"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Save, Calendar } from "lucide-react";

const TIME_PERIODS = [
  "08:00-10:00",
  "10:00-12:00",
  "12:00-14:00",
  "14:00-16:00",
  "16:00-18:00",
  "18:00-20:00",
  "20:00-22:00",
];

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// No color mapping — inputs use neutral styles

type ScheduleData = Record<string, Record<string, string>>;

export default function SchedulePage() {
  const [scheduleData, setScheduleData] = useState<ScheduleData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize empty schedule
  useEffect(() => {
    const initSchedule: ScheduleData = {};
    TIME_PERIODS.forEach((period) => {
      initSchedule[period] = {};
      WEEKDAYS.forEach((day) => {
        initSchedule[period][day] = "";
      });
    });
    setScheduleData(initSchedule);
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/schedule");
      if (!response.ok) {
        throw new Error("Failed to fetch schedule");
      }

      const result = await response.json();
      if (result.success && result.data?.weekData) {
        const parsedData = JSON.parse(result.data.weekData);
        setScheduleData(parsedData);
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
      toast.error("Failed to load schedule");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCellChange = (period: string, day: string, value: string) => {
    setScheduleData((prev) => ({
      ...prev,
      [period]: {
        ...prev[period],
        [day]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weekData: scheduleData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save schedule");
      }

      const result = await response.json();
      if (result.success) {
        toast.success("Schedule saved successfully!");
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast.error("Failed to save schedule");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-b-transparent animate-spin"></div>
        </div>
        <p className="text-muted-foreground">Loading schedule...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded-2xl">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  Study Schedule
                </h1>
                <p className="text-muted-foreground mt-1">
                  Plan your study goals for each time period throughout the week
                </p>
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="lg"
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Schedule"}
            </Button>
          </div>
        </div>

        {/* Schedule Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Study Plan</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* Table Header */}
              <div className="grid grid-cols-8 gap-2 mb-2">
                <div className="font-semibold text-sm text-muted-foreground p-2">
                  Time Period
                </div>
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="font-semibold text-sm text-center text-muted-foreground p-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Schedule Rows */}
              {TIME_PERIODS.map((period) => (
                <div
                  key={period}
                  className="grid grid-cols-8 gap-2 mb-2 items-center"
                >
                  {/* Time Period Label */}
                  <div className="font-medium text-sm p-2 bg-muted rounded-lg">
                    {period}
                  </div>

                  {/* Day Cells */}
                  {WEEKDAYS.map((day) => (
                    <Input
                      key={`${period}-${day}`}
                      value={scheduleData[period]?.[day] || ""}
                      onChange={(e) =>
                        handleCellChange(period, day, e.target.value)
                      }
                      placeholder="Study goal..."
                      className="text-sm bg-background"
                    />
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">How to Use</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              • Enter your study goals for each time period and day of the week
            </p>
            <p>
              • Examples: "Math homework", "Python study", "Review notes",
              "Project work"
            </p>
            <p>• Click "Save Schedule" to save your changes</p>
            <p>
              • Your schedule will be automatically saved and loaded when you
              return
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
