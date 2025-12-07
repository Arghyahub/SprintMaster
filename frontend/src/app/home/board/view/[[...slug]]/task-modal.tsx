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
import AdvDatePicker from "@/components/common/adv-date-picker";
import dayjs from "dayjs";
import UserEntity from "@/types/entities/user-entity";
import AdvSelect from "@/components/common/adv-select";

type Props = {
  isOpen: boolean;
  setisOpen: React.Dispatch<React.SetStateAction<boolean>>;
  boardId: number;
  setBoard: React.Dispatch<React.SetStateAction<BoardEntity>>;
  users: UserEntity[];
};

const defaultTask = new TaskEntity();

const TaskModal = ({ isOpen, setisOpen, boardId, setBoard, users }: Props) => {
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

  const assignables = useMemo(() => {
    return users.map((usr) => ({
      label: usr.name,
      value: usr.id,
    }));
  }, [users]);

  async function handleOpenModal(id: number) {
    setisOpen(true);
    try {
      const res = await Api.get(`/board/task/${id}`);
      if (res.data?.success) {
        const data = res?.data?.payload;
        if (!data) {
          toast.error("Task not found");
          return;
        }
        setTaskState({
          ...data,
          start_date: new Date(data.start_date),
          end_date: new Date(data?.end_date),
        });
        setEditedTask({
          ...data,
          start_date: new Date(data.start_date),
          end_date: new Date(data?.end_date),
        });
      } else {
        toast.error(res.data?.message ?? "Internal server error");
      }
    } catch (error) {
      console.log("error ", error);
      toast.error(error?.message ?? "Something went wrong");
    }
  }

  function onStartDateChange(value: Date): boolean {
    const editDataCopy = { ...EditedTask };
    editDataCopy.start_date = value;
    editDataCopy.start_date_error = "";
    if (!Util.isNotNull(value))
      editDataCopy.start_date_error = "Start date cannot be empty.";
    else if (
      Util.isNotNull(editDataCopy.end_date) &&
      dayjs(value).isAfter(dayjs(editDataCopy.end_date))
    ) {
      editDataCopy.end_date = null;
      editDataCopy.end_date_error = "";
    }
    setEditedTask(editDataCopy);
    return editDataCopy.start_date_error === "";
  }

  function onEndDateChange(value: Date): boolean {
    const endDateCopy = { ...EditedTask };
    endDateCopy.end_date = value;
    endDateCopy.end_date_error = "";
    if (!Util.isNotNull(value))
      endDateCopy.end_date_error = "End date cannot be empty.";
    else if (
      Util.isNotNull(EditedTask.start_date) &&
      dayjs(value).isBefore(dayjs(EditedTask.start_date))
    ) {
      endDateCopy.end_date_error = "End date cannot be before start date.";
    }
    setEditedTask(endDateCopy);
    return endDateCopy.end_date_error === "";
  }

  function onAssignedChange(id: number) {
    const copyState = { ...EditedTask };
    copyState.assigned_to_id = id;
    setEditedTask(copyState);
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
        start_date: EditedTask.start_date,
        end_date: EditedTask.end_date,
        assigned_to_id: EditedTask.assigned_to_id,
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
                {isTaskEdited && Util.isNotNull(EditedTask.name) && (
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
            <div className="flex flex-col gap-4 pt-6 pl-4 border-l-4 w-[400px] h-full">
              <AdvDatePicker
                label="Start Date"
                placeholder="Select Start Date"
                value={EditedTask.start_date}
                onChange={(date) => onStartDateChange(date)}
                error={EditedTask.start_date_error}
                id="start-date"
                minDate={new Date()}
              />
              <AdvDatePicker
                label="End Date"
                placeholder="Select End Date"
                value={EditedTask.end_date}
                onChange={(date) => onEndDateChange(date)}
                error={EditedTask.end_date_error}
                id="end-date"
                minDate={EditedTask.start_date ?? new Date()}
              />
              <AdvSelect
                options={assignables}
                value={EditedTask.assigned_to_id}
                onChange={onAssignedChange}
                label="Assigned to"
                placeholder="Assign a user"
              />
            </div>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default TaskModal;
