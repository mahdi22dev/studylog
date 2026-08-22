import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  DEFAULT_SESSION_SUBJECT,
  GENERAL_STUDY,
  SUBJECT_DISTRIBUTION_PALETTE,
  EMPTY_DISTRIBUTION,
} from "@/lib/constants";
import type { Session, SubjectDistribution } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const formatMinutes = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

export function mergeSessions(...lists: (Session[] | null | undefined)[]): Session[] {
  const map = new Map<string, Session>();
  for (const list of lists) {
    list?.forEach((s) => map.set(s.id, s));
  }
  return Array.from(map.values());
}

export function computeStreak(sessions: Session[]): number {
  if (!sessions || sessions.length === 0) return 0;

  const workSessions = sessions.filter(
    (s) => s.type !== "BREAK" && s.type !== "LONG_BREAK"
  );
  if (workSessions.length === 0) return 0;

  const activeDates = new Set<string>();
  for (const s of workSessions) {
    const d = new Date(s.startTime);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    activeDates.add(`${year}-${month}-${day}`);
  }

  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const todayStr = formatLocalDate(today);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = formatLocalDate(yesterday);

  let startDate = today;
  if (!activeDates.has(todayStr) && activeDates.has(yesterdayStr)) {
    startDate = yesterday;
  } else if (!activeDates.has(todayStr) && !activeDates.has(yesterdayStr)) {
    return 0;
  }

  let streak = 0;
  const current = new Date(startDate);

  for (let i = 0; i < 365; i++) {
    const key = formatLocalDate(current);
    if (activeDates.has(key)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function computeSubjectDistribution(sessions: Session[]): SubjectDistribution {
  const map = new Map<string, number>();

  const workSessions = sessions.filter(
    (s) => s.type !== "BREAK" && s.type !== "LONG_BREAK"
  );

  for (const s of workSessions) {
    const key = s.subject && s.subject.trim() !== "" ? s.subject.trim() : GENERAL_STUDY;
    map.set(key, (map.get(key) || 0) + (s.durationMin || 0));
  }

  const totalMins = Array.from(map.values()).reduce((a, b) => a + b, 0);

  if (totalMins === 0) {
    return { ...EMPTY_DISTRIBUTION };
  }

  const palette = SUBJECT_DISTRIBUTION_PALETTE;
  const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);

  const items = sorted.map(([name, mins], idx) => {
    const pct = Math.max(1, Math.round((mins / totalMins) * 100));
    const h = (mins / 60).toFixed(1);
    return {
      name,
      pct,
      hoursStr: `${h}h`,
      color: palette[idx % palette.length],
    };
  });

  const totalH = (totalMins / 60).toFixed(1);

  return {
    totalHoursStr: `${totalH}h`,
    items,
  };
}

export function getCurrentSessionSubject(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("currentSessionName") || DEFAULT_SESSION_SUBJECT;
  }
  return DEFAULT_SESSION_SUBJECT;
}
