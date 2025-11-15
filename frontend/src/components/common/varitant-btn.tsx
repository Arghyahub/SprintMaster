import React from "react";
import MiniLoader from "./mini-loader";
import { cn } from "@/lib/utils";

type Props = {
  disabled?: boolean;
  onClick?: () => any;
  classname?: string;
  isLoading?: boolean;
  label: string;
};

const VariantBtn = ({
  disabled,
  onClick,
  classname,
  isLoading,
  label,
}: Props) => {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(
        "flex justify-center items-center bg-teal-600 hover:bg-teal-700 p-2 rounded min-w-32 min-h-10 text-white transition duration-300",
        classname
      )}
    >
      {isLoading ? <MiniLoader className="size-5" /> : <>{label}</>}
    </button>
  );
};

export default VariantBtn;
