"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Session } from "@/lib/types";
import { getCurrentSessionSubject } from "@/lib/utils";

type Setter = (fn: (prev: number) => number) => void;

export function usePomodoroSession(
  setTotalMinutes: Setter,
  setTodayMinutes: Setter
) {
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isLongBreak, setIsLongBreak] = useState(false);
  const currentSession = useRef<Session | null>(null);

  const settersRef = useRef({ setTotalMinutes, setTodayMinutes });
  settersRef.current = { setTotalMinutes, setTodayMinutes };

  const createSession = useCallback(async () => {
    try {
      const res = await fetch("/api/add_session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime: new Date().toISOString(),
          type: "WORK",
          subject: getCurrentSessionSubject(),
        }),
      });

      if (!res.ok) {
        console.error("Failed to create study session, status:", res.status);
        return;
      }

      const data = await res.json();
      currentSession.current = data.message;
      console.log("Study session created:", currentSession.current);
    } catch (e) {
      console.error("Error creating study session:", e);
    }
  }, []);

  useEffect(() => {
    if (isBreak || isLongBreak) return;
    if (isActive && !currentSession.current) {
      createSession();
    }
  }, [isActive, isBreak, isLongBreak, createSession]);

  const updateTotalStudyTime = useCallback(
    async (minutes: number) => {
      if (minutes <= 0) return;
      settersRef.current.setTotalMinutes((prev) => prev + minutes);
      settersRef.current.setTodayMinutes((prev) => prev + minutes);

      if (!currentSession.current) {
        await createSession();
      }

      if (currentSession.current?.id) {
        try {
          await fetch("/api/increament", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: currentSession.current.id }),
          });
        } catch (e) {
          console.error("Error incrementing study session:", e);
        }
      }
    },
    [createSession]
  );

  const completedPomodoro = useCallback(async () => {
    try {
      if (currentSession.current?.id) {
        await fetch("/api/pomodoros", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentSession.current.id }),
        });
        currentSession.current = null;
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return {
    isActive,
    isBreak,
    isLongBreak,
    setIsActive,
    setIsBreak,
    setIsLongBreak,
    updateTotalStudyTime,
    completedPomodoro,
  };
}