"use client";
import Util from "@/utils/util";

const Env = {
  NEXT_PUBLIC_API_URL: getEnv("NEXT_PUBLIC_API_URL"),
};

function getEnv(key: string) {
  const val = process.env?.[key];
  console.log("val ", val);
  if (!Util.isNotNull(val))
    throw new Error(`Key (${key}) was not found in env file\n`);
  return val;
}

export default Env;
