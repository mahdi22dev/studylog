"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, Sparkles } from "lucide-react";

interface TimerSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  setAudioDisabled: Boolean;
  skipBreaks: boolean;
}

interface PomodoroTimerProps {
  settings: TimerSettings;
  setSettings: (settings: TimerSettings) => void;
  setTimeLeft: (seconds: number) => void;
  setIsActive: (active: boolean) => void;
  setIsBreak: (breakState: boolean) => void;
  setIsLongBreak: (longBreakState: boolean) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleSettingsChange: <K extends keyof TimerSettings>(
    key: K,
    value: TimerSettings[K]
  ) => void;
}

export default function TimerSettingsModal({
  isOpen,
  setIsOpen,
  settings,
  setSettings,
  setTimeLeft,
  setIsBreak,
  setIsLongBreak,
  setIsActive,
  handleSettingsChange,
}: PomodoroTimerProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("settings") === "true") {
        setIsOpen(true);
      }
    }
  }, [setIsOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="text-white/40 hover:text-[#6c47ff] transition-colors p-1 rounded-lg"
          aria-label="Timer settings"
        >
          <Settings className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#111827] border border-white/10 text-white rounded-2xl p-6 sm:max-w-md shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-sora text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#6c47ff]" />
            Timer Preferences
          </DialogTitle>
          <DialogDescription className="text-xs text-white/40">
            Customize your Pomodoro focus & break intervals
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="work-duration"
                className="text-[11px] font-semibold uppercase tracking-wider text-white/50"
              >
                Work Duration (m)
              </Label>
              <Input
                id="work-duration"
                type="number"
                min="1"
                max="120"
                value={settings.workDuration}
                onChange={(e) =>
                  handleSettingsChange(
                    "workDuration",
                    Number.parseInt(e.target.value) || 25
                  )
                }
                className="bg-[#1d1f27] border-white/10 text-white rounded-xl focus:border-[#6c47ff] focus:ring-[#6c47ff]"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="break-duration"
                className="text-[11px] font-semibold uppercase tracking-wider text-white/50"
              >
                Short Break (m)
              </Label>
              <Input
                id="break-duration"
                type="number"
                min="1"
                max="30"
                value={settings.breakDuration}
                onChange={(e) =>
                  handleSettingsChange(
                    "breakDuration",
                    Number.parseInt(e.target.value) || 5
                  )
                }
                className="bg-[#1d1f27] border-white/10 text-white rounded-xl focus:border-[#6c47ff] focus:ring-[#6c47ff]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="long-break-duration"
                className="text-[11px] font-semibold uppercase tracking-wider text-white/50"
              >
                Long Break (m)
              </Label>
              <Input
                id="long-break-duration"
                type="number"
                min="1"
                max="60"
                value={settings.longBreakDuration}
                onChange={(e) =>
                  handleSettingsChange(
                    "longBreakDuration",
                    Number.parseInt(e.target.value) || 15
                  )
                }
                className="bg-[#1d1f27] border-white/10 text-white rounded-xl focus:border-[#6c47ff] focus:ring-[#6c47ff]"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="sessions-until-long-break"
                className="text-[11px] font-semibold uppercase tracking-wider text-white/50"
              >
                Long Break Cycle
              </Label>
              <Input
                id="sessions-until-long-break"
                type="number"
                min="2"
                max="10"
                value={settings.sessionsUntilLongBreak}
                onChange={(e) =>
                  handleSettingsChange(
                    "sessionsUntilLongBreak",
                    Number.parseInt(e.target.value) || 4
                  )
                }
                className="bg-[#1d1f27] border-white/10 text-white rounded-xl focus:border-[#6c47ff] focus:ring-[#6c47ff]"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-[#1d1f27] p-3 rounded-xl border border-white/5">
            <Checkbox
              id="skip-breaks"
              checked={settings.skipBreaks}
              onCheckedChange={(checked) =>
                handleSettingsChange("skipBreaks", checked as boolean)
              }
              className="border-white/20 data-[state=checked]:bg-[#6c47ff] data-[state=checked]:border-[#6c47ff]"
            />
            <Label
              htmlFor="skip-breaks"
              className="text-xs font-medium text-white/80 cursor-pointer"
            >
              Auto-start next work session (skip break prompt)
            </Label>
          </div>

          <div className="flex justify-between gap-3 pt-2">
            <Button
              className="w-1/2 bg-transparent border border-white/10 text-white/60 hover:text-white rounded-full font-medium"
              variant="outline"
              onClick={() => {
                const resetSettings = {
                  workDuration: 25,
                  breakDuration: 5,
                  longBreakDuration: 15,
                  sessionsUntilLongBreak: 4,
                  setAudioDisabled: settings.setAudioDisabled,
                  skipBreaks: false,
                };
                setSettings(resetSettings);
                setTimeLeft(resetSettings.workDuration * 60);
                setIsBreak(false);
                setIsLongBreak(false);
                setIsActive(false);
                localStorage.setItem(
                  "pomodoroSettings",
                  JSON.stringify(resetSettings)
                );
                setIsOpen(false);
              }}
            >
              Reset Defaults
            </Button>
            <Button
              onClick={() => {
                setTimeLeft(settings.workDuration * 60);
                setIsBreak(false);
                setIsLongBreak(false);
                setIsActive(false);
                setIsOpen(false);
              }}
              className="w-1/2 bg-[#6c47ff] hover:bg-[#5e35f1] text-white rounded-full font-semibold shadow-[0_0_20px_rgba(108,71,255,0.3)]"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
