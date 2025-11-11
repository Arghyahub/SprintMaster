"use client";
import React, { useEffect, useState } from "react";

type Props = {};

const OfflinePage = (props: Props) => {
  const [IsOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  return (
    <>
      {IsOnline ? (
        <></>
      ) : (
        <div className="top-0 right-0 bottom-0 left-0 z-50 absolute flex flex-row justify-center bg-black opacity-80 w-full">
          <h1 className="mt-10 text-white text-2xl">
            {"You are offline ~_~ "}
          </h1>
        </div>
      )}
    </>
  );
};

export default OfflinePage;
