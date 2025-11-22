"use client";

import * as React from "react";
import { ChevronDownIcon, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip } from "react-tooltip";

type ErrorIdReq =
  | { error: string; id: string }
  | { error?: undefined; id?: string };

type Props = {
  label?: string;
  placeholder?: string;
  value?: Date;
  onChange?: (date: Date) => any;
  minDate?: Date;
} & ErrorIdReq;

function AdvDatePicker({
  label,
  placeholder,
  error,
  id,
  value,
  onChange,
  minDate,
}: Props) {
  const [open, setOpen] = React.useState(false);
  // const [date, setDate] = React.useState<Date | undefined>(undefined);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row min-h-4">
        {label && <label className="font-medium text-md">{label}</label>}
        {error && error !== "" && (
          <>
            <Info
              data-tooltip-id={id}
              data-tooltip-content={error}
              className="stroke-3 ml-auto rounded-full size-4 font-semibold text-red-400 cursor-pointer"
            />
            <Tooltip
              id={id}
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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="justify-between py-5 border border-slate-300 rounded w-[250px] font-normal text-gray-500"
          >
            {value ? (
              <span className="font-[500] text-black">
                {value.toLocaleDateString()}
              </span>
            ) : (
              placeholder || "Select date"
            )}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-auto overflow-hidden" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            disabled={{
              before: minDate,
            }}
            onSelect={(date) => {
              onChange && onChange(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default AdvDatePicker;
