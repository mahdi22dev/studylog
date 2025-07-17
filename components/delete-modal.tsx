import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dispatch, SetStateAction } from "react";

export function DeleteModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog defaultOpen={false} open={isOpen} onOpenChange={setIsOpen}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete All Your Data</DialogTitle>
            <DialogDescription>
              This action is irreversible. All your study data, including
              sessions and progress, will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="delete-confirm">
                To confirm, please type{" "}
                <span className="font-bold text-destructive">DELETE</span>{" "}
                below.
              </Label>
              <Input id="delete-confirm" autoComplete="off" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              variant="destructive"
              onClick={() => {
                alert("Data deleted!");
                setIsOpen(false);
              }}
            >
              Delete Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
