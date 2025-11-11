"use client";
import Image from "next/image";
import React, { useState } from "react";

type Props = {
  name?: string;
  role?: string;
  img?: any;
  text?: string;
};

const PeopleCard = ({ name, role, img: PeopleImg, text }: Props) => {
  const [CardIndex, setCardIndex] = useState(0);

  return (
    <div className="flex flex-col items-center gap-2 bg-white shadow-md p-6 rounded-lg max-w-64 md:max-w-72">
      <div className="flex flex-row gap-4 mr-auto h-14 max-h-14">
        <Image
          src={PeopleImg}
          alt={name || "Person Image"}
          width={50}
          height={50}
          className="rounded-full w-12 h-12 object-cover animate-fade-in"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-800 text-sm md:text-base animate-fade-in">
            {name}
          </h3>
          <p className="text-gray-600 text-xs animate-fade-in">{role}</p>
        </div>
      </div>
      <div className="text-sm md:text-base animate-fade-in">{text}</div>
    </div>
  );
};

export default PeopleCard;
