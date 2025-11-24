"use client";
import React, { useMemo, useState } from "react";
import AdvInput from "@/components/common/adv-input";
import { EllipsisVertical, Info } from "lucide-react";
import Util from "@/utils/util";
import StageEditModal from "./stage-edit-modal";
import StageDivider from "./stage-divider";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import StageCard from "./stage-card";
import { Tooltip } from "react-tooltip";

type Props = {
  BoardStages: { label: string; is_final: boolean }[];
  setBoardStages: React.Dispatch<
    React.SetStateAction<{ label: string; is_final: boolean }[]>
  >;
};

export const defaultModalState = {
  isOpen: false,
  stageIndex: -1,
  label: "",
  is_final: false,
  name_error: "",
};

const StageComponent = ({ BoardStages, setBoardStages }: Props) => {
  const [ModalState, setModalState] = useState(defaultModalState);
  const [activeIdx, setActiveIdx] = useState(-1);

  const boardError = useMemo(() => {
    let final = 0,
      nonFinal = 0;
    BoardStages.forEach((stage) => {
      if (stage.is_final) final++;
      else nonFinal++;
    });

    if (final == 0) return "At least one final stage is required.";
    if (nonFinal == 0) return "At least one non-final stage is required.";

    return "";
  }, [BoardStages]);

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

  const addNewStage = (idx: number) => {
    const stages = [...BoardStages];
    stages.splice(idx, 0, {
      label: "New Stage",
      is_final: stages[idx - 1]?.is_final || false,
    });
    setBoardStages(stages);
  };

  function handleDragEnd(e: DragEndEvent) {
    const fromIndex = e.active.data.current.index;
    const toIndex = e.over?.data.current.index;

    if (
      !Util.isNotNull(toIndex) ||
      !Util.isNotNull(fromIndex) ||
      fromIndex == toIndex
    ) {
      setActiveIdx(-1);
      return;
    }

    const finalOutput: typeof BoardStages = [];

    for (let i = 0; i <= BoardStages.length; i++) {
      if (i == fromIndex) continue;
      else {
        if (i == toIndex) {
          const isFinal =
            i > 0 ? BoardStages[i - 1].is_final : BoardStages[i].is_final;
          finalOutput.push({ ...BoardStages[fromIndex], is_final: isFinal });
        }
        if (i < BoardStages.length) finalOutput.push({ ...BoardStages[i] });
      }
    }

    setBoardStages(finalOutput);
    setActiveIdx(-1);
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-row justify-start gap-4">
        <p className="text-gray-500 text-sm">
          Final stages always moved to the end
        </p>
        {Util.isNotNull(boardError) && (
          <>
            <Info
              data-tooltip-id={"stage-info"}
              data-tooltip-content={boardError}
              className="stroke-3 rounded-full size-4 font-semibold text-red-400 cursor-pointer"
            />
            <Tooltip
              id={"stage-info"}
              style={{
                color: "white",
                background: "red",
                fontSize: "0.9rem",
                padding: "0.2rem 0.4rem",
                maxWidth: "200px",
              }}
            />
          </>
        )}
      </div>

      <div className="flex flex-row gap-2 pb-4 w-full overflow-x-auto whitespace-nowrap transition delay-500">
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          onDragStart={(event) =>
            setActiveIdx(event.active.data.current.index ?? -1)
          }
          onDragCancel={() => setActiveIdx(-1)}
        >
          <StageDivider index={0} onClick={() => addNewStage(0)} />
          {BoardStages.map((stage, index) => (
            <div key={index} className="flex flex-row gap-2">
              <StageCard
                stage={stage}
                index={index}
                setModalState={setModalState}
              />
              <StageDivider
                index={index + 1}
                onClick={() => addNewStage(index + 1)}
              />
            </div>
          ))}
          <DragOverlay dropAnimation={null}>
            {activeIdx >= 0 && activeIdx < BoardStages.length ? (
              <StageCard
                stage={BoardStages[activeIdx]}
                index={activeIdx}
                setModalState={setModalState}
                className="cursor-grabbing"
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <StageEditModal
        ModalState={ModalState}
        setModalState={setModalState}
        setBoardStages={setBoardStages}
        BoardStages={BoardStages}
      />
    </div>
  );
};

export default StageComponent;
