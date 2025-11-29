import { BoardStageEntity } from "@/types/entities/board=entity";
import React from "react";
import TaskCard from "./task-card";
import { useDroppable } from "@dnd-kit/core";
import TaskDivider from "./task-divider";

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
      <div className="flex flex-col pt-2 pb-4 w-full h-full overflow-y-auto hide-scrollbar">
        <TaskDivider index={-1} stageId={stage.id} />
        {stage.tasks.map((task, idx) => (
          <div key={task.id} className="flex flex-col w-full">
            <TaskCard task={task} stageId={stage.id} />
            <TaskDivider index={idx + 1} stageId={stage.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StageColumn;
