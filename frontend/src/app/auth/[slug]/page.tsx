// "use client";
import Image from "next/image";
import React from "react";
import LoginForm from "./login-form";
import { Metadata } from "next";
import config from "@/config/config";

export const metadata: Metadata = {
  title: "Login",
  description: "Login/Signup to your account",
};

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex flex-row w-full h-[100svh]">
      <div className="hidden md:flex flex-col justify-center items-center w-full h-full">
        <Image
          alt="Login Svg"
          src={"/auth-img/login.jpg"}
          width={500}
          height={600}
        />
      </div>
      <div className="flex flex-col justify-center items-center w-full h-full">
        <h1 className="md:hidden mb-2 text-2xl">
          Join <span className="text-teal-600">{config.title}</span> now
        </h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default page;
