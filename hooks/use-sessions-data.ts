"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@/lib/types";

export function useSessionsData() {
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [todaySessions, setTodaySessions] = useState<Session[]>([]);
  const [weeklySessions, setWeeklySessions] = useState<Session[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [sessionsCountToday, setSessionsCountToday] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    setIsLoading(true);
    try {
      await Promise.all([
        fetch("/api/recent_sessions?limit=1000")
          .then((r) => r.json())
          .then((d) => {
            if (d.sessions) setRecentSessions(d.sessions);
          })
          .catch(console.error),

        fetch(
          `/api/sessions_period?period=today&timezone=${encodeURIComponent(tz)}`
        )
          .then((r) => r.json())
          .then((d) => {
            if (d.success && d.data) {
              setTodaySessions(d.data.sessions || []);
              setTodayMinutes(d.data.totalMinutes || 0);
              const workCount = (d.data.sessions || []).filter(
                (s: Session) => s.type === "WORK"
              ).length;
              setSessionsCountToday(workCount);
            }
          })
          .catch(console.error),

        fetch("/api/get_time")
          .then((r) => r.json())
          .then((d) => {
            if (typeof d.totalMinutes === "number") {
              setTotalMinutes(d.totalMinutes);
            }
          })
          .catch(console.error),

        fetch(`/api/avarge?timezone=${encodeURIComponent(tz)}`)
          .then((r) => r.json())
          .then((d) => {
            if (Array.isArray(d)) setWeeklySessions(d);
            else if (d.message && Array.isArray(d.message))
              setWeeklySessions(d.message);
          })
          .catch(console.error),
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    recentSessions,
    todaySessions,
    weeklySessions,
    totalMinutes,
    todayMinutes,
    sessionsCountToday,
    isLoading,
    setTotalMinutes,
    setTodayMinutes,
    refresh,
  };
}