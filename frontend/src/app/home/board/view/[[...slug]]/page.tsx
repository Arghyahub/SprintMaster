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

type Props = {};

const defaultBoard = new BoardEntity();

const page = (props: Props) => {
  const [IsLoading, setIsLoading] = useState(false);
  const { slug } = useParams();
  const boardId = useMemo(() => slug?.[0], [slug]);
  const [Board, setBoard] = useState(defaultBoard);
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
        toast.error(res.data?.message ?? "Error fetching board");
      }
    } catch (error) {
      console.error("Error fetching board:", error);
      toast.error("Error fetching board");
    } finally {
      setIsLoading(false);
    }
  }

  function handleDragEnd(e: DragEndEvent) {
    const fromTask = e.active;
    const toStage = e.over;
    if (!Util.isNotNull(fromTask) || !Util.isNotNull(toStage)) return;
    if (
      fromTask.data?.current?.type !== "task-card" ||
      toStage.data?.current?.type !== "stage-column"
    )
      return;

    const BoardCopy: BoardEntity = { ...Board };
    BoardCopy.boardStages = BoardCopy.boardStages.map((stage) => {
      const tasks = stage.tasks.filter(
        (task) => task.id !== fromTask?.data?.current?.id
      );

      // Inserting at start, need to change that
      if (toStage?.data?.current?.id == stage.id) {
        tasks.unshift(fromTask.data?.current?.task);
      }

      stage.tasks = [...tasks];

      return stage;
    });

    setBoard(BoardCopy);
  }

  useEffect(() => {
    fetchBoard();
  }, [boardId]);

  if (IsLoading) return <Loader />;
  return (
    <div className="flex flex-col gap-6 h-full">
      <h1 className="text-3xl">{`Board ${Board.name}`}</h1>

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
          {/* <StageDivider index={0} onClick={() => addNewStage(0)} /> */}
          {Board.boardStages?.map((stage) => (
            <StageColumn stage={stage} key={stage.id} />
          ))}
        </DndContext>
      </div>
    </div>
  );
};

export default page;
