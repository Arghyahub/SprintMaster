"use client";
import Loader from "@/components/common/loader";
import BoardEntity from "@/types/entities/board=entity";
import Api from "@/utils/api";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CircleUserRound } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import TaskCard from "./task-card";
import StageColumn from "./stage-column";
import Util from "@/utils/util";
import VariantBtn from "@/components/common/varitant-btn";
import TaskModal from "./task-modal";

type Props = {};

const defaultBoard = new BoardEntity();

const page = (props: Props) => {
  const [IsLoading, setIsLoading] = useState(false);
  const { slug } = useParams();
  const boardId = useMemo(() => slug?.[0], [slug]);
  const [Board, setBoard] = useState(defaultBoard);
  const [isModalOpen, setisModalOpen] = useState(false);
  const router = useRouter();
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  async function fetchBoard() {
    try {
      setIsLoading(true);
      const res = await Api.get(`/board/${boardId}`);
      if (res.status >= 200 && res.status < 400 && res.data?.payload) {
        setBoard(res.data.payload);
      } else if (res.status == 404) {
        toast.error("Board not found.");
        router.push("/home/board");
        return;
      } else {
        router.push("/home/board");
        toast.error(res.data?.message ?? "Error fetching board");
      }
    } catch (error) {
      console.error("Error fetching board:", error);
      toast.error("Error fetching board");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDragEnd(e: DragEndEvent) {
    const fromTask = e.active;
    const toStage = e.over;

    let finalIdx = 0;

    if (!Util.isNotNull(fromTask) || !Util.isNotNull(toStage)) return;

    if (
      fromTask.data?.current?.type !== "task-card" ||
      (toStage.data?.current?.type !== "stage-column" &&
        toStage.data?.current?.type !== "task-divider")
    )
      return;

    const BoardCopy: BoardEntity = { ...Board };
    BoardCopy.boardStages = BoardCopy.boardStages.map((stage) => {
      const tasks = stage.tasks.filter(
        (task) => task.id !== fromTask?.data?.current?.id
      );

      if (toStage?.data?.current?.id == stage.id) {
        const index = toStage?.data?.current?.index;
        finalIdx = index ?? tasks.length;

        const newTask = fromTask.data?.current?.task;
        if (Util.isNotNull(index)) tasks.splice(index, 0, { ...newTask });
        else tasks.push({ ...newTask });
      }

      stage.tasks = [...tasks];

      return stage;
    });

    setBoard(BoardCopy);

    try {
      const payload = {
        taskId: fromTask?.data?.current?.id,
        stageId: toStage?.data?.current?.id,
        index: finalIdx,
      };

      const res = await Api.post("/board/task/move", payload);
      if (res.data.success) {
        console.log("Task moved successfully");
      } else {
        toast.error(res.data.message ?? "Server error");
      }
    } catch (error) {
      console.log("error ", error);
      toast.error("Unable to update task to server, Kindly reload");
    }
  }

  useEffect(() => {
    fetchBoard();
  }, [boardId]);

  if (IsLoading) return <Loader />;
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl">{`Board ${Board.name}`}</h1>
        <VariantBtn label="Create Task" onClick={() => setisModalOpen(true)} />
      </div>

      <div className="flex flex-row gap-4 w-full h-full overflow-x-auto hide-scrollbar">
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          onDragStart={
            (event) => {}
            // setActiveIdx(event.active.data.current.index ?? -1)
          }
          onDragCancel={
            () => {}
            // setActiveIdx(-1)
          }
        >
          {Board.boardStages?.map((stage) => (
            <StageColumn stage={stage} key={stage.id} />
          ))}
        </DndContext>
      </div>
      <TaskModal
        isOpen={isModalOpen}
        setisOpen={setisModalOpen}
        boardId={Number(boardId)}
        setBoard={setBoard}
      />
    </div>
  );
};

export default page;
