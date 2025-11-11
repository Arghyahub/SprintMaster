import dotenv from "dotenv";
import Util from "../util/utils";
dotenv.config();

const Env = {
  DATABASE_URL: getEnv("DATABASE_URL"),
  PORT: getEnv("PORT"),
  FRONTEND_URL: getEnv("FRONTEND_URL"),
  ACCESS_SECRET: getEnv("ACCESS_SECRET"),
  REFRESH_SECRET: getEnv("REFRESH_SECRET"),
  DEV_ENV: getEnv("DEV_ENV"),
};

function getEnv(key: string) {
  const val = process.env?.[key];
  if (val === undefined || val === null || val === "")
    throw new Error(`Key (${key}) was not found in env file\n`);
  return val;
}

export default Env;
