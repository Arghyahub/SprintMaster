import { BoardStageEntity } from "@/types/entities/board=entity";
import React from "react";
import TaskCard from "./task-card";
import { useDroppable } from "@dnd-kit/core";

type Props = {
  stage: BoardStageEntity;
};

const StageColumn = ({ stage }: Props) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `stage-column-${stage.id}`,
    data: {
      type: "stage-column",
      id: stage.id,
      stage: stage,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col p-2 border-2 border-gray-400 rounded w-80 min-w-80 h-full"
    >
      <div className="top-0 sticky flex flex-row justify-center px-2 py-3 border-gray-300 border-b-2 w-full font-medium text-xl">
        {stage.name}
      </div>
      <div className="flex flex-col py-4 w-full h-full overflow-y-auto hide-scrollbar">
        {stage.tasks.map((task) => (
          <TaskCard task={task} key={task.id} />
        ))}
      </div>
    </div>
  );
};

export default StageColumn;
