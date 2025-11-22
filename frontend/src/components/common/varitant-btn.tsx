import React from "react";
import MiniLoader from "./mini-loader";
import { cn } from "@/lib/utils";

type Props = {
  disabled?: boolean;
  onClick?: () => any;
  classname?: string;
  isLoading?: boolean;
  label: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
};

const VariantBtn = ({
  disabled,
  onClick,
  classname,
  isLoading,
  label,
  type = "button",
  variant = "primary",
}: Props) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(
        "flex justify-center items-center bg-teal-600 hover:bg-teal-700 p-2 rounded min-w-32 min-h-10 text-white transition duration-300",
        { "bg-gray-400 hover:bg-gray-500": variant == "secondary" },
        classname
      )}
    >
      {isLoading ? <MiniLoader className="size-5" /> : <>{label}</>}
    </button>
  );
};

export default VariantBtn;
