import React from "react";

type Props = {
  Icon: React.ElementType;
  name: string;
  description: string;
};

const ShortFeatureCard = ({ Icon, name, description }: Props) => {
  return (
    <div className="flex flex-col items-center bg-white shadow-md hover:shadow-lg p-6 rounded-lg w-72 lg:w-1/4 min-w-72 transition-shadow duration-300">
      <Icon className="mb-4 size-5 md:size-10 text-teal-600" />
      <h3 className="font-semibold text-gray-800 text-base sm:text-xl">
        {name}
      </h3>
      <p className="mt-2 text-gray-600 text-sm sm:text-base text-center">
        {description}
      </p>
    </div>
  );
};

export default ShortFeatureCard;
