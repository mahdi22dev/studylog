"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  SetStateAction,
  Dispatch,
} from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Timer,
  Fullscreen,
  VolumeX,
  Volume2,
  Minimize2,
  Calendar,
  BookOpen,
} from "lucide-react";
import { clearInterval, setInterval } from "worker-timers";
import { useSettingsDialog } from "@/contexts/settingsDialogContext";
// @ts-expect-error: No type definitions for 'howler'
import { Howl } from "howler";
import TimerSettings from "./pomodoro-timer-dialog";
import { cn } from "@/lib/utils";

interface PomodoroTimerProps {
  onStudyTimeUpdate: (minutes: number) => void;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  isActive: boolean;
  setIsBreak: Dispatch<SetStateAction<boolean>>;
  setIsLongBreak: Dispatch<SetStateAction<boolean>>;
  isBreak: boolean;
  isLongBreak: boolean;
  completedPomodoro: () => void;
}

interface TimerSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  setAudioDisabled: Boolean;
  skipBreaks: boolean;
}

export default function PomodoroTimer({
  onStudyTimeUpdate,
  setIsActive,
  isActive,
  setIsBreak,
  setIsLongBreak,
  isBreak,
  isLongBreak,
  completedPomodoro,
}: PomodoroTimerProps) {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const defaults: TimerSettings = {
      workDuration: 25,
      breakDuration: 5,
      longBreakDuration: 15,
      sessionsUntilLongBreak: 4,
      setAudioDisabled: false,
      skipBreaks: false,
    };
    if (typeof window === "undefined") return defaults;
    const saved = localStorage.getItem("pomodoroSettings");
    return saved ? (JSON.parse(saved) as TimerSettings) : defaults;
  });

  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [minutesToAdd, setMinutesToAdd] = useState(0);
  const firstMount = useRef<boolean>(false);
  const intervalRef = useRef<number | null>(null);
  const { isOpen, setIsOpen } = useSettingsDialog();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const [sessionName, setSessionName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("currentSessionName") || "Physics";
    }
    return "Physics";
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      boxRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const savedSettings = localStorage.getItem("pomodoroSettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings) as TimerSettings;
      setTimeLeft(parsed.workDuration * 60);
    }

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("autostart") === "true") {
        setIsActive(true);
      }
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === boxRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [setIsActive]);

  useEffect(() => {
    if (sessionName) {
      localStorage.setItem("currentSessionName", sessionName);
    }
  }, [sessionName]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  useEffect(() => {
    if (!firstMount.current) {
      firstMount.current = true;
    } else {
      localStorage.setItem("pomodoroSettings", JSON.stringify(settings));
    }
  }, [settings]);

  useEffect(() => {
    if (minutesToAdd > 0) {
      onStudyTimeUpdate(minutesToAdd);
      setMinutesToAdd(0);
    }
  }, [minutesToAdd, onStudyTimeUpdate]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (!isBreak && !isLongBreak && prev > 0) {
            const currentMinute = Math.floor(prev / 60);
            const newMinute = Math.floor(newTime / 60);
            if (currentMinute > newMinute && newTime >= 0) {
              setMinutesToAdd(1);
            }
          }
          return Math.max(0, newTime);
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, isBreak, isLongBreak]);

  const pomodorCompletedNoti = () => {
    const sound = new Howl({
      src: ["/bell.mp3"],
      volume: 4,
    });
    sound.play();
  };

  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      if (!settings.setAudioDisabled) {
        pomodorCompletedNoti();
      }
      if (!isBreak && !isLongBreak) {
        const newCompletedCount = completedPomodoros + 1;
        setCompletedPomodoros(newCompletedCount);
        completedPomodoro();

        if (settings.skipBreaks) {
          setIsBreak(false);
          setIsLongBreak(false);
          setTimeLeft(settings.workDuration * 60);
        } else {
          if (newCompletedCount % settings.sessionsUntilLongBreak === 0) {
            setIsLongBreak(true);
            setTimeLeft(settings.longBreakDuration * 60);
          } else {
            setIsBreak(true);
            setTimeLeft(settings.breakDuration * 60);
          }
          setIsActive(false);
        }
      } else {
        setIsBreak(false);
        setIsLongBreak(false);
        setTimeLeft(settings.workDuration * 60);
        setIsActive(false);
      }
    }
  }, [timeLeft, isActive, isBreak, isLongBreak, completedPomodoros, settings, completedPomodoro, setIsActive, setIsBreak, setIsLongBreak]);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setIsBreak(false);
    setIsLongBreak(false);
    setTimeLeft(settings.workDuration * 60);
    setMinutesToAdd(0);
    setCompletedPomodoros(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [settings.workDuration, setIsActive, setIsBreak, setIsLongBreak]);

  const formatDisplayTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getCurrentMode = () => {
    if (isLongBreak) return "Long Break";
    if (isBreak) return "Break";
    return "Focus";
  };

  const toggleTimer = useCallback(() => {
    setIsActive(!isActive);
  }, [isActive, setIsActive]);

  const handleSettingsChange = <K extends keyof TimerSettings>(
    key: K,
    value: TimerSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    if (!isActive) {
      setIsBreak(false);
      setIsLongBreak(false);
      setTimeLeft(newSettings.workDuration * 60);
    }
  };

  let maxDurationSeconds = settings.workDuration * 60;
  if (isLongBreak) maxDurationSeconds = settings.longBreakDuration * 60;
  else if (isBreak) maxDurationSeconds = settings.breakDuration * 60;

  const strokeOffset =
    283 - (283 * (maxDurationSeconds - timeLeft)) / maxDurationSeconds;

  return (
    <div
      className={cn(
        "w-full bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden glow-active",
        isFullscreen && "flex justify-center items-center flex-col bg-background"
      )}
      ref={boxRef}
    >
      {/* Top Header Pill with Settings */}
      <div className="flex items-center gap-2 mb-6 bg-muted py-1.5 px-4 rounded-full border border-border z-10">
        <Timer className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">Pomodoro Timer</span>
        <TimerSettings
          isOpen={isOpen}
          setIsActive={setIsActive}
          setIsOpen={setIsOpen}
          settings={settings}
          setSettings={setSettings}
          setTimeLeft={setTimeLeft}
          setIsBreak={setIsBreak}
          setIsLongBreak={setIsLongBreak}
          handleSettingsChange={handleSettingsChange}
        />
        <div className="flex items-center gap-1.5 ml-2 border-l border-border pl-2">
          <button onClick={toggleFullscreen} className="text-muted-foreground hover:text-foreground transition-colors">
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Fullscreen className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => handleSettingsChange("setAudioDisabled", !settings.setAudioDisabled)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {settings.setAudioDisabled ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Mode Badge */}
      <div className="mb-4 inline-flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 py-1 px-4 rounded-full text-xs font-semibold z-10">
        {isLongBreak ? (
          <>
            <Coffee className="h-3.5 w-3.5" />
            Long Break
          </>
        ) : isBreak ? (
          <>
            <Coffee className="h-3.5 w-3.5" />
            Break Time
          </>
        ) : (
          <>
            <Play className="h-3.5 w-3.5 fill-current" />
            Deep Focus
          </>
        )}
      </div>

      {/* Session Title Subject */}
      {!isBreak && !isLongBreak && (
        <div className="flex items-center justify-center gap-2 mb-6 z-10">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          {isEditingName ? (
            <input
              ref={nameInputRef}
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setIsEditingName(false);
              }}
              className="text-sm font-semibold text-center bg-background border border-primary/50 rounded-lg px-3 py-1 text-foreground focus:outline-none"
              maxLength={40}
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors px-2 py-0.5 rounded hover:bg-accent"
            >
              {sessionName}
            </button>
          )}
        </div>
      )}

      {/* Duration Selector */}
      {!isActive && !isBreak && !isLongBreak && (
        <div className="flex gap-2 mb-8 z-10">
          {[25, 30, 60].map((duration) => (
            <button
              key={duration}
              onClick={() => {
                handleSettingsChange("workDuration", duration);
                setTimeLeft(duration * 60);
              }}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium transition-all border",
                settings.workDuration === duration
                  ? "bg-primary/20 text-primary border-primary/40 glow-active"
                  : "bg-transparent text-muted-foreground border-border hover:bg-accent hover:text-foreground"
              )}
            >
              {duration}m
            </button>
          ))}
        </div>
      )}

      {/* Circular Progress Timer */}
      <div className="relative flex justify-center items-center w-64 h-64 mb-8 z-10">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" fill="none" r="45" stroke="hsl(var(--secondary) / 0.2)" strokeWidth="4" />
          <circle
            className="transition-all duration-1000"
            cx="50"
            cy="50"
            fill="none"
            r="45"
            stroke="hsl(var(--primary))"
            strokeDasharray="283"
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            strokeWidth="4"
            style={{ filter: "drop-shadow(0 0 15px hsl(var(--primary) / 0.6))" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center font-sora text-6xl font-extrabold text-card-foreground tracking-tighter">
          {formatDisplayTime(timeLeft)}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 z-10">
        <Button
          onClick={toggleTimer}
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-sm py-3 px-8 rounded-full flex items-center gap-2 glow-primary transition-colors border-0"
        >
          {isActive ? (
            <>
              <Pause className="h-4 w-4 fill-current" />
              Pause Focus
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" />
              Start Focus
            </>
          )}
        </Button>

        <Button
          onClick={resetTimer}
          variant="outline"
          className="bg-transparent border border-border text-muted-foreground hover:text-foreground font-semibold text-sm py-3 px-6 rounded-full flex items-center gap-2 transition-colors hover:bg-accent"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* Footer session counter details */}
      <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border w-full mt-8 z-10">
        <div className="text-center">
          <div className="text-xl font-bold text-card-foreground font-sora">{completedPomodoros}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-primary font-sora">{getCurrentMode()}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Mode</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-card-foreground font-sora">
            {Math.floor(completedPomodoros / settings.sessionsUntilLongBreak)}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Cycles</div>
        </div>
      </div>
    </div>
  );
}
