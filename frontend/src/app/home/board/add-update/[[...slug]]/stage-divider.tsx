import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { CircleFadingPlus } from "lucide-react";
import React from "react";

type Props = {
  onClick: () => any;
  index: number;
};

const StageDivider = ({ onClick, index }: Props) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `stage-divider-${index}`,
    data: { type: "stage-divider", index: index },
  });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "group flex flex-col justify-center items-center gap-1 pb-1 w-4"
      )}
    >
      <button
        className={cn("hidden group-hover:flex", isOver && "hidden")}
        onClick={onClick}
      >
        <CircleFadingPlus size={15} />
      </button>
      {isOver && (
        <div className="border border-gray-600 rounded-lg h-full transition"></div>
      )}
    </div>
  );
};

export default StageDivider;
