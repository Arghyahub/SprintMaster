"use client";
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

import VariantBtn from "@/components/common/varitant-btn";
import { Switch } from "@/components/ui/switch";
import AdvInput from "@/components/common/adv-input";
import { cn } from "@/lib/utils";
import { defaultModalState } from "./stage-comp";
import Util from "@/utils/util";

type ModalStateType = {
  isOpen: boolean;
  stageIndex: number;
  label: string;
  is_final: boolean;
  name_error: string;
  value?: number;
};

type Props = {
  ModalState: ModalStateType;
  setModalState: React.Dispatch<React.SetStateAction<ModalStateType>>;
  setBoardStages: React.Dispatch<
    React.SetStateAction<
      {
        label: string;
        is_final: boolean;
      }[]
    >
  >;
  BoardStages: {
    label: string;
    is_final: boolean;
    value?: number;
  }[];
  editingId: number;
};

const StageEditModal = ({
  ModalState,
  setModalState,
  BoardStages,
  setBoardStages,
  editingId,
}: Props) => {
  function onNameChange(value: string): boolean {
    const copyState = { ...ModalState };
    copyState.name_error = "";
    copyState.label = value;
    if (!Util.isNotNull(value))
      copyState.name_error = "Stage name cannot be empty";
    setModalState(copyState);
    return copyState.name_error == "";
  }

  function handleStageChange() {
    const validation = onNameChange(ModalState.label);
    if (!validation) return;

    const stages = [...BoardStages];
    if (ModalState.stageIndex >= 0 && ModalState.stageIndex < stages.length) {
      stages[ModalState.stageIndex] = {
        label: ModalState.label,
        is_final: ModalState.is_final,
        value: ModalState?.value,
      };
    }

    // Reorder final stages to the end
    stages.sort((a, b) => Number(a.is_final) - Number(b.is_final));

    setBoardStages(stages);
    setModalState(defaultModalState);
  }

  function handleStageDelete() {
    const stages = [...BoardStages];
    if (ModalState.stageIndex >= 0 && ModalState.stageIndex < stages.length) {
      stages.splice(ModalState.stageIndex, 1);
    }
    setBoardStages(stages);
    setModalState(defaultModalState);
  }

  return (
    <Dialog
      open={ModalState.isOpen}
      onOpenChange={(open) => setModalState({ ...ModalState, isOpen: open })}
    >
      <form onSubmit={handleStageChange}>
        <DialogContent
          className="sm:max-w-[425px]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Edit Stage</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <AdvInput
              id="name-1"
              maxLength={25}
              name="name"
              label="Stage Name"
              value={ModalState.label}
              onChange={(e) => onNameChange(e.target.value)}
              props={{
                autoFoxus: false,
              }}
              error={ModalState.name_error}
            />
            <div className="flex flex-row justify-between items-center">
              <p>Final Stage</p>
              <Switch
                id="airplane-mode"
                className={cn({ "!bg-green-500": ModalState.is_final })}
                checked={ModalState.is_final}
                onCheckedChange={(checked) =>
                  setModalState({ ...ModalState, is_final: checked })
                }
              />
            </div>
          </div>
          <DialogFooter className="flex flex-row gap-4 mt-4">
            {!Util.isNotNull(editingId) && (
              <DialogClose asChild>
                <VariantBtn
                  label="Delete"
                  onClick={handleStageDelete}
                  variant="danger"
                />
              </DialogClose>
            )}
            <VariantBtn
              label="Save"
              type="submit"
              onClick={handleStageChange}
            />
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default StageEditModal;
