"use client";

import { Timer, Trash2, RotateCcw } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { ResetModal } from "./reset-modal";
import { useSettingsDialog } from "@/contexts/settingsDialogContext";

export const UserButtonModel = () => {
  const [isDelete, setIsDelete] = useState(false);
  const { setIsOpen } = useSettingsDialog();

  return (
    <>
      <SignedIn>
        <UserButton>
          {" "}
          <UserButton.MenuItems>
            {/* TODO: Implement delete data functionality */}
            <UserButton.Action
              label="Pomodoro settings"
              labelIcon={<Timer className="w-[17px] h-[17px]" />}
              onClick={() => setIsOpen(true)}
            />
          </UserButton.MenuItems>
          <UserButton.MenuItems>
            {/* TODO: Implement delete data functionality */}
            <UserButton.Action
              label="Reset data"
              labelIcon={
                <RotateCcw className="w-[17px] h-[17px] text-destructive" />
              }
              onClick={() => setIsDelete(true)}
            />
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>
      <ResetModal isOpen={isDelete} setIsOpen={setIsDelete} />
    </>
  );
};
