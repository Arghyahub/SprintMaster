"use client";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { EllipsisVertical } from "lucide-react";
import React from "react";

type Props = {
  stage: { label: string; is_final: boolean };
  index: number;
  setModalState: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      stageIndex: number;
      label: string;
      is_final: boolean;
      name_error: string;
    }>
  >;
  className?: string;
};

const StageCard = ({ stage, index, setModalState, className = "" }: Props) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `stage-card-${index}`,
      data: {
        type: "stage-card",
        index: index,
      },
    });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "relative flex shadow px-5 py-3 border-2 border-gray-300 rounded text-sm cursor-grab",
        { "border-green-400": stage.is_final },
        className
      )}
      // key={index}
    >
      <p>{stage.label}</p>
      <EllipsisVertical
        className="top-1 right-1 absolute cursor-pointer"
        size={13}
        onClick={() =>
          setModalState({
            isOpen: true,
            stageIndex: index,
            label: stage.label,
            is_final: stage.is_final,
            name_error: "",
          })
        }
      />
    </div>
  );
};

export default StageCard;
