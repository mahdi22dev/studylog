"use client";
import { createContext, useContext, useState } from "react";

type SettingsDialogContextType = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const SettingsDialogContext = createContext<
  SettingsDialogContextType | undefined
>(undefined);

export const SettingsDialogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SettingsDialogContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SettingsDialogContext.Provider>
  );
};

export const useSettingsDialog = () => {
  const context = useContext(SettingsDialogContext);
  if (!context) {
    throw new Error(
      "useSettingsDialog must be used within SettingsDialogProvider"
    );
  }
  return context;
};
