"use client";

import { ThemeProvider } from "next-themes";
import { SettingsDialogProvider } from "./settingsDialogContext";

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <SettingsDialogProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </SettingsDialogProvider>
  );
}
