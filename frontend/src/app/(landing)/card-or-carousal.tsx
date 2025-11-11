"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import PeopleCard from "./people-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  data: {
    name: string;
    description: string;
    icon?: any;
    role: string;
  }[];
};

const CardOrCarousel = ({ data }: Props) => {
  const [CurrCardIndex, setCurrCardIndex] = useState(0);
  const [ScreenWidth, setScreenWidth] = useState(getScreenWidth());

  const smallWindow = ScreenWidth < 640;

  function getScreenWidth() {
    return typeof window !== "undefined" ? window.innerWidth : 1400;
  }

  const goNext = () => {
    setCurrCardIndex((prev) => (prev + 1) % data.length);
  };

  const goPrev = () => {
    setCurrCardIndex((prev) => (prev == 0 ? data.length - 1 : prev - 1));
  };

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setScreenWidth(getScreenWidth());
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-row gap-4 md:gap-8 mx-auto px-4">
      {smallWindow ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-row items-center gap-2">
            <ChevronLeft onClick={goPrev} className="min-w-5" />
            <PeopleCard
              key={CurrCardIndex}
              name={data[CurrCardIndex].name}
              role={data[CurrCardIndex].role}
              img={data[CurrCardIndex].icon}
              text={data[CurrCardIndex].description}
            />
            <ChevronRight onClick={goNext} className="min-w-5" />
          </div>
        </div>
      ) : (
        <>
          {data.map((item, index) => (
            <PeopleCard
              key={index}
              name={item.name}
              role={item.role}
              img={item.icon}
              text={item.description}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default CardOrCarousel;
