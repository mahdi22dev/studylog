"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";

interface TimerSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  setAudioDisabled: Boolean;
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
  handleSettingsChange: (key: keyof TimerSettings, value: number) => void;
}
export default function TimerSettings({
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
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
          <DialogDescription>
            Customize your Pomodoro timer durations
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="work-duration">Work Duration (minutes)</Label>
            <Input
              id="work-duration"
              type="number"
              min="1"
              max="60"
              value={settings.workDuration}
              onChange={(e) =>
                handleSettingsChange(
                  "workDuration",
                  Number.parseInt(e.target.value) || 25
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="break-duration">Short Break (minutes)</Label>
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="long-break-duration">Long Break (minutes)</Label>
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sessions-until-long-break">
              Sessions until Long Break
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
            />
          </div>
          <div className="flex justify-between gap-3">
            <Button
              className="w-full"
              variant={"outline"}
              onClick={() => {
                const resetSettings = {
                  workDuration: 25,
                  breakDuration: 5,
                  longBreakDuration: 15,
                  sessionsUntilLongBreak: 4,
                  setAudioDisabled: settings.setAudioDisabled,
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
              Reset Settings
            </Button>{" "}
            <Button
              onClick={() => {
                setTimeLeft(settings.workDuration * 60);
                setIsBreak(false);
                setIsLongBreak(false);
                setIsActive(false);
                setIsOpen(false);
              }}
              className="w-full"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
