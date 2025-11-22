import { cn } from "@/lib/utils";
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
import React, { useState } from "react";
import AdvInput from "@/components/common/adv-input";
import { EllipsisVertical } from "lucide-react";
import VariantBtn from "@/components/common/varitant-btn";
import { Switch } from "@/components/ui/switch";
import Util from "@/utils/util";

type Props = {
  BoardStages: { label: string; is_final: boolean }[];
  setBoardStages: React.Dispatch<
    React.SetStateAction<{ label: string; is_final: boolean }[]>
  >;
};

const defaultModalState = {
  isOpen: false,
  stageIndex: -1,
  label: "",
  is_final: false,
  name_error: "",
};

const StageComponent = ({ BoardStages, setBoardStages }: Props) => {
  const [ModalState, setModalState] = useState(defaultModalState);

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
      };
    }

    // Reorder

    setBoardStages(stages);
    setModalState(defaultModalState);
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-gray-500 text-sm">
        Final stages always moved to the end
      </p>

      <div className="flex flex-row gap-2">
        {BoardStages.map((stage, index) => (
          <div
            className={cn(
              "relative flex shadow px-5 py-3 border-2 border-gray-300 rounded text-sm cursor-grab",
              { "border-green-400": stage.is_final }
            )}
            key={index}
          >
            <p>{stage.label}</p>
            <EllipsisVertical
              className="top-1 right-1 absolute cursor-pointer"
              size={13}
              onClick={() =>
                setModalState({
                  isOpen: true,
                  stageIndex: index,
                  label: stage.label,
                  is_final: stage.is_final,
                  name_error: "",
                })
              }
            />
          </div>
        ))}
      </div>

      <Dialog
        open={ModalState.isOpen}
        onOpenChange={(open) => setModalState({ ...ModalState, isOpen: open })}
      >
        <form onSubmit={handleStageChange}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Stage</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <AdvInput
                id="name-1"
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
              <DialogClose asChild>
                <VariantBtn label="Cancel" variant="secondary" />
              </DialogClose>
              <VariantBtn
                label="Save"
                type="submit"
                onClick={handleStageChange}
              />
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default StageComponent;
