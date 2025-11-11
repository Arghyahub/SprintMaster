"use client";
import React, { useEffect } from "react";

type Props = {};

const SWRegistrar = (props: Props) => {
  useEffect(() => {
    if (typeof window == "undefined") return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => console.log("Service Worker registered:", reg.scope))
        .catch((err) =>
          console.error("Service Worker registration failed:", err)
        );
    }
  }, []);

  return <></>;
};

export default SWRegistrar;
