import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import React, { memo } from "react";
import { Tooltip } from "react-tooltip";

type ErrorIdReq =
  | { error: string; id: string }
  | { error?: undefined; id?: string };

type Props = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  // error?: string;
  name?: string;
  // id?: string;
  maxLength?: number;
  SuffixIcon?: React.JSX.Element;
} & ErrorIdReq;

const AdvInput = ({
  label,
  className = "",
  onChange,
  placeholder,
  type = "text",
  value,
  error,
  name,
  id,
  SuffixIcon,
  maxLength = 250,
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
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          id={id}
          maxLength={maxLength}
          className={cn(
            "p-2 border border-slate-300 rounded w-full",
            { "border-r-0 rounded-r-none": !!SuffixIcon },
            className
          )}
        />
        {SuffixIcon && (
          <div className="flex justify-center items-center border-y border-r border-l-0 rounded h-full aspect-square">
            {SuffixIcon}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(AdvInput);
