import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import React, { memo } from "react";
import { Tooltip } from "react-tooltip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ErrorIdReq =
  | { error: string; id: string }
  | { error?: undefined; id?: string };

type Props = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (val: any) => any;
  className?: string;
  options: { label: string; value: any }[];
} & ErrorIdReq;

const AdvSelect = ({
  label,
  error,
  id,
  placeholder = "",
  options,
  value,
  onChange,
  className,
}: Props) => {
  return (
    <div className={"flex flex-col gap-1"}>
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
      <div className="flex flex-row">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger
            className={cn("border-slate-300 w-[180px] min-h-11", className)}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options?.map((op, idx) => (
                <SelectItem key={idx} value={op.value} className="py-2">
                  {op.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AdvSelect;
