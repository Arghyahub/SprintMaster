import { cn } from "@/lib/utils";
import TaskEntity from "@/types/entities/task-entity";
import { DragOverlay, useDraggable } from "@dnd-kit/core";
import { CircleUserRound } from "lucide-react";
import React from "react";

type Props = {
  task: TaskEntity;
};

const TaskCard = ({ task }: Props) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `task-card-${task.id}`,
      data: {
        type: "task-card",
        id: task.id,
        task: task,
      },
    });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex flex-col shadow-md p-4 border border-gray-600 rounded transition ease-in-out hover:cursor-grab delay",
        { "bg-gray-100 border-gray-500 text-gray-600": isDragging }
      )}
    >
      <h4 className="font-medium text-lg">{task.name}</h4>
      <div className="flex flex-row justify-end w-full">
        <CircleUserRound />
      </div>
      <DragOverlay dropAnimation={null}>
        {isDragging && (
          <div
            className={cn(
              "flex flex-col shadow-md p-4 border border-gray-600 rounded transition ease-in-out cursor-grabbing delay"
            )}
          >
            <h4 className="font-medium text-lg">{task.name}</h4>
            <div className="flex flex-row justify-end w-full">
              <CircleUserRound />
            </div>
          </div>
        )}
      </DragOverlay>
    </div>
  );
};

export default TaskCard;
