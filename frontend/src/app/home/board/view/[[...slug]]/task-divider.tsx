import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import React from "react";

type Props = {
  index: number;
  stageId: number;
};

const TaskDivider = ({ index, stageId }: Props) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `task-divider-${index}-stage-${stageId}`,
    data: { type: "task-divider", index: index, id: stageId },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn("w-full h-4 transition", { "bg-teal-100": isOver })}
    ></div>
  );
};

export default TaskDivider;
