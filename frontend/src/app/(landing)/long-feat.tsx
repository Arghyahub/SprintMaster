import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type Props = {
  index: number;
  name: string;
  description: string;
  img: string;
};

const LongFeat = ({ index, img, name, description }: Props) => {
  const isEven = index % 2 === 0;

  // Alternate order in big screens even->right odd->left
  // and in small screens all to left

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row  items-center gap-6 mb-2 px-4 md:px-15 w-full",
        isEven ? "flex-col" : "flex-col sm:flex-row-reverse"
      )}
    >
      <div className="flex flex-row justify-around">
        <Image
          src={img}
          alt={`Feature ${index + 1}`}
          width={500}
          height={500}
          className="rounded-md h-auto size-[300px] md:size-[400px] lg:size-auto"
        />
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <h3 className="mb-2 font-semibold text-gray-800 text-2xl md:text-3xl">
          {name}
        </h3>
        <p className="max-w-5/6 text-gray-600 text-base">{description}</p>
      </div>
    </div>
  );
};

export default LongFeat;
