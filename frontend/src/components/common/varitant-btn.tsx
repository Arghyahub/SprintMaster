import React from "react";
import MiniLoader from "./mini-loader";

type Props = {
  disabled?: boolean;
  onClick?: () => any;
  classname?: string;
  isLoading?: boolean;
  text: string;
};

const VariantBtn = ({
  disabled,
  onClick,
  classname,
  isLoading,
  text,
}: Props) => {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      onClick={onClick}
      className="flex justify-center items-center bg-teal-600 hover:bg-teal-700 p-2 rounded min-w-32 min-h-10 text-white transition duration-300"
    >
      {isLoading ? <MiniLoader className="size-5" /> : <>{text}</>}
    </button>
  );
};

export default VariantBtn;
