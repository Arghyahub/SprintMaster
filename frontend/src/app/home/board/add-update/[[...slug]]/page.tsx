"use client";
import AdvDatePicker from "@/components/common/adv-date-picker";
import AdvInput from "@/components/common/adv-input";
import Util from "@/utils/util";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import AdvSelect from "@/components/common/adv-select";
import { DndContext } from "@dnd-kit/core";
import StageComponent from "./stage-comp";
import VariantBtn from "@/components/common/varitant-btn";
import { toast } from "sonner";
import Api from "@/utils/api";

type Props = {};

const BoardStageOptions = {
  development: [
    { label: "To Do", is_final: false },
    { label: "In Progress", is_final: false },
    { label: "Code Review", is_final: false },
    { label: "In Production", is_final: false },
    { label: "Done", is_final: true },
  ],
  marketing: [
    { label: "Planning", is_final: false },
    { label: "Designing", is_final: false },
    { label: "In Progress", is_final: false },
    { label: "In Review", is_final: false },
    { label: "Done", is_final: true },
  ],
  sales: [
    { label: "Lead Generated", is_final: false },
    { label: "Contacted", is_final: false },
    { label: "Proposal Sent", is_final: false },
    { label: "Negotiation", is_final: false },
    { label: "Closed Lost", is_final: true },
    { label: "Closed Won", is_final: true },
  ],
  hr: [
    { label: "Application Received", is_final: false },
    { label: "Phone Screen", is_final: false },
    { label: "Interview", is_final: false },
    { label: "Offer Extended", is_final: false },
    { label: "Hired", is_final: true },
    { label: "Rejected", is_final: true },
  ],
  design: [
    { label: "Concept", is_final: false },
    { label: "Wireframe", is_final: false },
    { label: "Design", is_final: false },
    { label: "Review", is_final: false },
    { label: "Finalized", is_final: true },
  ],
  customer_support: [
    { label: "Raised Ticket", is_final: false },
    { label: "In Progress", is_final: false },
    { label: "Resolved", is_final: true },
    { label: "Closed", is_final: true },
  ],
  custom: [
    { label: "Todo", is_final: false },
    { label: "Done", is_final: true },
  ],
};

type BoardStageKey = keyof typeof BoardStageOptions;

const BoardStageSelections = Object.keys(BoardStageOptions).map((key) => ({
  label: key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "),
  value: key,
}));

const BoardStatusOptions = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Active", value: "in_progress" },
  { label: "Completed", value: "completed" },
] as const;

const page = (props: Props) => {
  const { slug } = useParams();
  const [BoardName, setBoardName] = useState({ value: "", error: "" });
  const [Startdate, setStartdate] = useState({ value: null, error: "" });
  const [Enddate, setEnddate] = useState({ value: null, error: "" });
  const [BoardStageSelectikon, setBoardStageSelectikon] =
    useState<BoardStageKey>("development");
  const [BoardStages, setBoardStages] = useState(BoardStageOptions.development);
  const [BoardStatus, setBoardStatus] = useState({
    value: "upcoming",
    error: "",
  });

  const router = useRouter();

  const editingId = useMemo(
    () => (Number.isInteger(Number(slug?.[0])) ? Number(slug[0]) : undefined),
    [slug]
  );

  function onChangeBoardName(value: string): boolean {
    const boardNameCopy = { ...BoardName };
    boardNameCopy.value = value;
    boardNameCopy.error = "";
    if (!Util.isNotNull(value))
      boardNameCopy.error = "Board name cannot be empty.";
    setBoardName(boardNameCopy);
    return boardNameCopy.error === "";
  }

  function onStartDateChange(value: Date): boolean {
    const startDateCopy = { ...Startdate };
    startDateCopy.value = value;
    startDateCopy.error = "";
    if (!Util.isNotNull(value))
      startDateCopy.error = "Start date cannot be empty.";
    else if (
      Util.isNotNull(Enddate.value) &&
      dayjs(value).isAfter(dayjs(Enddate.value))
    ) {
      setEnddate({ value: null, error: "" });
    }
    setStartdate(startDateCopy);
    return startDateCopy.error === "";
  }

  function onEndDateChange(value: Date): boolean {
    const endDateCopy = { ...Enddate };
    endDateCopy.value = value;
    endDateCopy.error = "";
    if (!Util.isNotNull(value)) endDateCopy.error = "End date cannot be empty.";
    else if (
      Util.isNotNull(Startdate.value) &&
      dayjs(value).isBefore(dayjs(Startdate.value))
    ) {
      endDateCopy.error = "End date cannot be before start date.";
    }
    setEnddate(endDateCopy);
    return endDateCopy.error === "";
  }

  function onStatusChange(type: string): boolean {
    const statusCopy = { ...BoardStatus };
    statusCopy.value = type;
    statusCopy.error = "";
    if (!Util.isNotNull(type)) statusCopy.error = "Status cannot be empty.";
    setBoardStatus(statusCopy);
    return statusCopy.error === "";
  }

  function onStageSelectionChange(value: BoardStageKey) {
    setBoardStageSelectikon(value);
    setBoardStages(BoardStageOptions[value]);
  }

  async function handleSubmit() {
    console.log("here");
    const validations = [
      onChangeBoardName(BoardName.value),
      onStartDateChange(Startdate.value),
      onEndDateChange(Enddate.value),
      onStatusChange(BoardStatus.value),
      !BoardStages.every((stage) => stage.is_final == true),
      !BoardStages.every((stage) => stage.is_final == false),
    ].every((v) => v === true);

    if (!validations) {
      return;
    }

    try {
      const data = {
        id: editingId,
        name: BoardName.value,
        start_date: Startdate.value,
        end_date: Enddate.value,
        status: BoardStatus.value,
        stages: BoardStages,
      };

      const res = await Api.post("/board/create-update", data);

      if (res.status >= 200 && res.status < 400) {
        toast.success(
          `Board ${editingId ? "updated" : "created"} successfully.`
        );
        router.push("/home/board");
      } else {
        toast.error(
          res.data?.message || "Failed to save board. Please try again."
        );
      }
    } catch (error) {
      toast.error("Failed to save board. Please try again.");
    }
  }

  useEffect(() => {}, [editingId]);

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <h1 className="mb-2 text-3xl">{editingId ? "Edit" : "Add"} Board</h1>
      <div className="flex flex-row flex-wrap gap-6 w-full">
        <AdvInput
          label="Name"
          placeholder="Board Name"
          value={BoardName.value}
          onChange={(e) => onChangeBoardName(e.target.value)}
          error={BoardName.error}
          id="board-name"
        />
        <AdvSelect
          options={BoardStatusOptions.filter(
            (item) => !(item.value == "completed" && !editingId)
          )}
          value={BoardStatus.value}
          onChange={onStatusChange}
          label="Board Status"
        />
        <AdvDatePicker
          label="Start Date"
          placeholder="Select Start Date"
          value={Startdate.value}
          onChange={(date) => onStartDateChange(date)}
          error={Startdate.error}
          id="start-date"
          minDate={new Date()}
        />
        <AdvDatePicker
          label="End Date"
          placeholder="Select End Date"
          value={Enddate.value}
          onChange={(date) => onEndDateChange(date)}
          error={Enddate.error}
          id="end-date"
          minDate={new Date()}
        />
      </div>
      {/* <div className="flex flex-row gap-6 w-full">
      </div> */}
      <div className="flex flex-row gap-6 w-full">
        <AdvSelect
          options={BoardStageSelections}
          value={BoardStageSelectikon}
          onChange={onStageSelectionChange}
          label="Board Type"
        />
      </div>
      <div className="flex">
        <StageComponent
          BoardStages={BoardStages}
          setBoardStages={setBoardStages}
        />
      </div>

      <div className="flex flex-row justify-end mt-2 pr-10">
        <VariantBtn
          label={editingId ? "Save Board" : "Create Board"}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default page;
