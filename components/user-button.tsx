"use client";

import { Timer, Trash2, RotateCcw, ArrowRight } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { ResetModal } from "./reset-modal";
import { useSettingsDialog } from "@/contexts/settingsDialogContext";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const UserButtonModel = () => {
  const [isDelete, setIsDelete] = useState(false);
  const [isHome, setIsHome] = useState(false);
  const { setIsOpen } = useSettingsDialog();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      setIsHome(true);
    }
  }, [pathname]);

  return (
    <>
      <SignedIn>
        {isHome ? (
          <>
            <Link
              href="/dashboard/me"
              className="bg-[#6c47ff] text-white px-8 py-3.5 rounded-full text-base font-semibold tracking-wide hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#6c47ff]/25 flex items-center gap-2.5 group"
            >
              Dashboard
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </>
        ) : (
          <UserButton>
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
        )}
      </SignedIn>
      <ResetModal isOpen={isDelete} setIsOpen={setIsDelete} />
    </>
  );
};
