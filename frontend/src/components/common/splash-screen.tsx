import config from "@/config/config";
import React from "react";

type Props = {};

const SplashScreen = (props: Props) => {
  return (
    <div className="flex flex-col justify-center items-center w-[100vw] h-[100svh]">
      <video
        src={"/screen-loader/splash-screen-vid.mp4"}
        autoPlay
        loop
        muted
        className="max-w-[670px]"
      />
      <h1 className="font-roboto font-bold text-teal-600 text-2xl sm:text-3xl animate-pulse">
        Getting you into <span className="animate-none">{config.title}</span>
      </h1>
    </div>
  );
};

export default SplashScreen;
