import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import React, { memo, TextareaHTMLAttributes } from "react";
import { Tooltip } from "react-tooltip";

type ErrorIdReq =
  | { error: string; id: string }
  | { error?: undefined; id?: string };

type Props = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: React.HTMLInputTypeAttribute | "text-area";
  className?: string;
  layoutClassName?: string;
  // error?: string;
  name?: string;
  // id?: string;
  maxLength?: number;
  SuffixIcon?: React.JSX.Element;
  additionalProps?:
    | TextareaHTMLAttributes<HTMLTextAreaElement>
    | React.InputHTMLAttributes<HTMLInputElement>;
  props?: any;
} & ErrorIdReq;

const AdvInput = ({
  label,
  className = "",
  layoutClassName = "",
  onChange,
  placeholder,
  type = "text",
  value,
  error,
  name,
  id,
  SuffixIcon,
  maxLength = 250,
  additionalProps = {},
  props,
}: Props) => {
  return (
    <div className={cn("flex flex-col gap-1 min-w-[250px]", layoutClassName)}>
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
      <div className="flex flex-row w-full">
        {type == "text-area" ? (
          <textarea
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e as any)}
            name={name}
            id={id}
            onWheel={(e) => {
              if (type === "number") {
                (e.target as HTMLElement).blur();
              }
            }}
            maxLength={maxLength}
            className={cn(
              "p-2 border border-slate-300 rounded w-full",
              { "border-r-0 rounded-r-none": !!SuffixIcon },
              className
            )}
            {...(additionalProps as any)}
          />
        ) : (
          <input
            // {...props}
            autoFocus={false}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            id={id}
            onWheel={(e) => {
              if (type === "number") {
                (e.target as HTMLElement).blur();
              }
            }}
            maxLength={maxLength}
            className={cn(
              "p-2 border border-slate-300 rounded w-full",
              { "border-r-0 rounded-r-none": !!SuffixIcon },
              className
            )}
            {...(additionalProps as any)}
          />
        )}
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
