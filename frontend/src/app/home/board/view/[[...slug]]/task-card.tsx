import { cn } from "@/lib/utils";
import TaskEntity from "@/types/entities/task-entity";
import Util from "@/utils/util";
import { DragOverlay, useDraggable } from "@dnd-kit/core";
import { CircleUserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";

type Props = {
  task: TaskEntity;
  stageId: number;
};

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
  }
  hash = Math.abs(hash) % 0xffffff;
  return "#" + hash.toString(16).padStart(6, "0");
}

const TaskCard = ({ task, stageId }: Props) => {
  const router = useRouter();
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `task-card-${task.id}`,
      data: {
        type: "task-card",
        id: task.id,
        task: task,
        stageId,
      },
    });

  const assigedName = useMemo(() => {
    if (!Util.isNotNull(task?.assigned_to_user?.name)) return null;
    const nameParts = task?.assigned_to_user?.name?.split(" ").slice(0, 2);
    const finalName = nameParts.map((str) => str?.[0]?.toUpperCase()).join("");
    const hash = stringToColor(task.assigned_to_user?.name);
    return { name: finalName, color: hash };
  }, [task?.assigned_to_user?.name]);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => router.push(`?task=${task.id}`)}
      className={cn(
        "flex flex-col gap-4 shadow-md p-4 border border-gray-600 rounded transition ease-in-out hover:cursor-grab delay",
        { "bg-gray-100 border-gray-500 text-gray-600": isDragging }
      )}
    >
      <h4 className="font-medium text-lg">{task.name}</h4>
      <div className="flex flex-row justify-end w-full">
        {assigedName ? (
          <p
            className="flex justify-center items-center rounded-full size-8 text-white text-sm"
            style={{ backgroundColor: assigedName.color }}
          >
            {assigedName.name}
          </p>
        ) : (
          <CircleUserRound className="size-8" />
        )}
      </div>
      <DragOverlay dropAnimation={null}>
        {isDragging && (
          <div
            className={cn(
              "flex flex-col gap-4 shadow-md p-4 border border-gray-600 rounded transition ease-in-out cursor-grabbing delay"
            )}
          >
            <h4 className="font-medium text-lg">{task.name}</h4>
            <div className="flex flex-row justify-end w-full">
              {assigedName ? (
                <p
                  className="flex justify-center items-center rounded-full size-8 text-white text-sm"
                  style={{ backgroundColor: assigedName.color }}
                >
                  {assigedName.name}
                </p>
              ) : (
                <CircleUserRound className="size-8" />
              )}
            </div>
          </div>
        )}
      </DragOverlay>
    </div>
  );
};

export default TaskCard;
