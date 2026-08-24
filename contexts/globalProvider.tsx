"use client";

import { ThemeProvider } from "next-themes";
import { SettingsDialogProvider } from "./settingsDialogContext";

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <SettingsDialogProvider>
      <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
    </SettingsDialogProvider>
  );
}
