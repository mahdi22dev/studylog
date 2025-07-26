"use client";

import { SettingsDialogProvider } from "./settingsDialogContext";

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  return <SettingsDialogProvider>{children}</SettingsDialogProvider>;
}
