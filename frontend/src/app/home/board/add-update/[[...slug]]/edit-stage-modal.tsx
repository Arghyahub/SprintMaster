import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdvInput from "@/components/common/adv-input";
import { EllipsisVertical } from "lucide-react";

type Props = {
  defaultValue: { label: string; is_final: boolean };
};

const EditStageModal = (props: Props) => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <button className="top-1 right-1 absolute cursor-pointer">
            <EllipsisVertical size={13} />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="gap-4 grid">
            <div className="gap-3 grid">
              <label htmlFor="name-1">Name</label>
              <AdvInput id="name-1" name="name" />
            </div>
            <div className="gap-3 grid">
              <label htmlFor="username-1">Username</label>
              <AdvInput id="username-1" name="username" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <button>Cancel</button>
            </DialogClose>
            <button type="submit">Save changes</button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default EditStageModal;
