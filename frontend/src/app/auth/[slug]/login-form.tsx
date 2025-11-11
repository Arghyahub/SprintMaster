"use client";
import AdvInput from "@/components/common/adv-input";
import MiniLoader from "@/components/common/mini-loader";
import Api from "@/utils/api";
import Validator from "@/utils/validator";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { memo, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const defaultErrorState = {
  nameError: "",
  emailError: "",
  passwordError: "",
};

// function getScreenWidth() {
//   if (typeof window !== "undefined") {
//     return window.innerWidth;
//   }
//   return 1400; // Default value for server-side rendering
// }

const LoginForm = () => {
  // States
  const [Errors, setErrors] = useState(defaultErrorState);
  const [ShowPassword, setShowPassword] = useState(false);
  const [IsLoading, setIsLoading] = useState(false);
  // const [ScreenWidth, setScreenWidth] = useState(getScreenWidth());
  //

  // Hooks
  const router = useRouter();
  const { slug } = useParams();

  const isLogin = useMemo(() => slug == "login", [slug]);

  useEffect(() => {
    setErrors(defaultErrorState);
    setShowPassword(false);
  }, [isLogin]);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setScreenWidth(getScreenWidth());
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);
  //

  const nameChecker = (value: string): boolean => {
    const isValid = Validator.isValidName(value);
    setErrors((prev) => ({
      ...prev,
      nameError: isValid ? "" : "Name must be at least 3 characters long.",
    }));
    return isValid;
  };

  const emailChecker = (value: string): boolean => {
    const isValid = Validator.isValidEmail(value);
    setErrors((prev) => ({
      ...prev,
      emailError: isValid ? "" : "Please enter a valid email address.",
    }));
    return isValid;
  };

  const passwordChecker = (value: string): boolean => {
    const isValid = Validator.isValidPassword(value);
    setErrors((prev) => ({
      ...prev,
      passwordError: isValid
        ? ""
        : "Password must contain 8 character including uppercase, special character and a number",
    }));
    return isValid;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const name = e.target.name.value,
      password = e.target.password.value,
      email = e.target.email.value;
    const nameValid = nameChecker(name) || isLogin;
    const passwordValid = passwordChecker(password);
    const emailValid = emailChecker(email);

    if ([nameValid, passwordValid, emailValid].some((item) => item == false))
      return;

    try {
      setIsLoading(true);
      const res = await Api.post(`/auth/${isLogin ? "login" : "signup"}`, {
        name,
        password,
        email,
      });

      console.log("res :\n", res.data);

      const payload = res?.data?.payload;

      if (res.status == 200 && payload) {
        toast.success(res.data.message);
        Api.setAccessToken(payload.accessToken);
        router.push("/home");
      } else {
        toast.error(res.data?.message || "Something went wrong");
        console.log(res.data?.error);
      }
    } catch (error) {
      console.log("error :\n", error);
      toast.error("Something went wrong, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col shadow-lg p-6 md:p-10 rounded-lg">
      <h2 className="mb-2 font-bold text-xl md:text-2xl">
        {isLogin ? "Login" : "Sign Up"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {!isLogin && (
          <AdvInput
            type="text"
            placeholder="Name"
            className="w-full sm:w-64 md:w-72"
            name="name"
            error={Errors.nameError}
            id="name-input"
            maxLength={50}
            onChange={(e) => nameChecker(e.target.value)}
          />
        )}
        <AdvInput
          type="email"
          placeholder="Email"
          className="w-full sm:w-64 md:w-72"
          name="email"
          error={Errors.emailError}
          id="email-input"
          maxLength={100}
          onChange={(e) => emailChecker(e.target.value)}
        />
        <AdvInput
          type={ShowPassword ? "text" : "password"}
          placeholder="Password"
          name="password"
          className="outline-0 w-full"
          error={Errors.passwordError}
          id="password-input"
          maxLength={100}
          onChange={(e) => passwordChecker(e.target.value)}
          SuffixIcon={
            ShowPassword ? (
              <EyeOff
                onClick={() => setShowPassword((prev) => !prev)}
                strokeWidth={1.2}
                className="cursor-pointer"
              />
            ) : (
              <Eye
                onClick={() => setShowPassword((prev) => !prev)}
                strokeWidth={1.2}
                className="cursor-pointer"
              />
            )
          }
        />
        <button
          type="submit"
          disabled={IsLoading}
          className="flex justify-center items-center bg-teal-600 hover:bg-teal-700 mt-4 p-2 rounded text-white transition duration-300"
        >
          {/* {IsLoading ? <MiniLoader /> : <>{isLogin ? "Login" : "Sign Up"}</>} */}
          {IsLoading ? <MiniLoader /> : <>{isLogin ? "Login" : "Signup"}</>}
        </button>
      </form>

      <div className="flex mt-4">
        {isLogin ? (
          <p className="text-gray-600 text-sm">
            Don't have an account ?{" "}
            <Link href="/auth/signup" className="text-test4">
              Sign Up
            </Link>
          </p>
        ) : (
          <p className="text-gray-600 text-sm">
            Already have an account ?{" "}
            <Link href="/auth/login" className="text-test4">
              Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default memo(LoginForm);
