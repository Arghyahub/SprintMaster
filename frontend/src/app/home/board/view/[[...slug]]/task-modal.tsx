"use client";
import { Button } from "@/components/ui/button";
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
import Util from "@/utils/util";
import { useRouter, useSearchParams } from "next/navigation";
import equal from "fast-deep-equal";

import React, { useEffect, useMemo, useState } from "react";
import AdvInput from "@/components/common/adv-input";
import VariantBtn from "@/components/common/varitant-btn";
import TaskEntity from "@/types/entities/task-entity";
import BoardEntity from "@/types/entities/board=entity";
import Api from "@/utils/api";
import { Description } from "@radix-ui/react-dialog";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  setisOpen: React.Dispatch<React.SetStateAction<boolean>>;
  boardId: number;
  setBoard: React.Dispatch<React.SetStateAction<BoardEntity>>;
};

const defaultTask = new TaskEntity();

const TaskModal = ({ isOpen, setisOpen, boardId, setBoard }: Props) => {
  const router = useRouter();
  const [showSkeleton, setshowSkeleton] = useState(false);
  const [TaskState, setTaskState] = useState(defaultTask);
  const [EditedTask, setEditedTask] = useState(defaultTask);

  const params = useSearchParams();
  const taskId = useMemo(() => {
    const taskId = params.get("task");
    if (Util.isNotNull(taskId)) return Number(taskId);
  }, [params]);
  const isTaskEdited = useMemo(
    () => !equal(TaskState, EditedTask),
    [TaskState, EditedTask]
  );

  async function handleOpenModal(id: number) {
    setisOpen(true);
    try {
    } catch (error) {}
  }

  function handleCloseModal() {
    try {
      if (params?.get("task")) {
        const newParams = new URLSearchParams(window.location.search);
        newParams.delete("task");
        router.replace(`?${newParams?.toString()}`);
      }
    } catch (error) {
      console.log("error ", error);
    } finally {
      setisOpen(false);
      setEditedTask(defaultTask);
      setTaskState(defaultTask);
    }
  }

  async function handleSubmitTask() {
    if (!Util.isNotNull(EditedTask.name)) return;
    try {
      const res = await Api.post("/board/task/create-update", {
        name: EditedTask.name,
        description: EditedTask.description,
        boardId: boardId,
      });

      if (res.status >= 200 && res.status < 400) {
        toast.success(res.data?.message ?? "Board updated successfully");
        if (res.data?.payload) setBoard(res.data.payload);
      } else {
        toast.error(res.data?.message ?? "Something went wrong");
      }
    } catch (error) {
      console.log("error ", error);
    }
  }

  useEffect(() => {
    if (Util.isNotNull(taskId)) handleOpenModal(Number(taskId));
  }, [taskId]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleCloseModal();
      }}
    >
      <form>
        <DialogContent
          className="md:min-w-[900px] xl:min-w-[1200px] max-w-[80vw] md:min-h-[500px] xl:min-h-[600px] max-h-[80vh]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex flex-row gap-2 px-2 w-full h-full">
            <div className="flex flex-col pr-2 w-full h-full">
              <AdvInput
                className="border-none focus:outline-0 font-semibold text-3xl"
                placeholder="Task Tittle"
                value={EditedTask.name}
                onChange={(e) =>
                  setEditedTask((prev) => ({
                    ...prev,
                    name: e.target.value,
                    name_error: Util.isNotNull(e.target.value)
                      ? ""
                      : "Task name is required",
                  }))
                }
                error={EditedTask.name_error}
                id="task-name"
              />
              <AdvInput
                type="text-area"
                className="w-full h-full overflow-y-auto text-md"
                layoutClassName="h-full"
                placeholder="Task description here..."
                value={EditedTask?.description}
                onChange={(e) =>
                  setEditedTask((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
              <div className="flex flex-row justify-end gap-4 pt-4 h-[62px]">
                {isTaskEdited && (
                  <>
                    <DialogClose asChild>
                      <VariantBtn
                        label="Cancel"
                        variant="secondary"
                        onClick={handleCloseModal}
                      />
                    </DialogClose>
                    <VariantBtn label="Save" onClick={handleSubmitTask} />
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col border-l-4 w-[400px] h-full"></div>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default TaskModal;
