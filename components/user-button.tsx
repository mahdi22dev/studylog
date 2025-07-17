"use client";
import { Timer, Trash2 } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { DeleteModal } from "./delete-modal";

export const UserButtonModel = () => {
  const [isDelete, setIsDelete] = useState(false);

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
              onClick={() => setIsDelete(!isDelete)}
            />
          </UserButton.MenuItems>
          <UserButton.MenuItems>
            {/* TODO: Implement delete data functionality */}
            <UserButton.Action
              label="Delete data"
              labelIcon={
                <Trash2 className="w-[17px] h-[17px] text-destructive" />
              }
              onClick={() => setIsDelete(true)}
            />
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>
      <DeleteModal isOpen={isDelete} setIsOpen={setIsDelete} />
    </>
  );
};
