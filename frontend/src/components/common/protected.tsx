"use client";
import useGlobalStore from "@/store/global-store";
import Api from "@/utils/api";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";
import SplashScreen from "./splash-screen";
import useUserStore from "@/store/user-store";
import UserEntity from "@/types/entities/user-entity";
import Util from "@/utils/util";
type Props = {
  children: React.ReactNode;
};

interface fullRefreshPayload {
  accessToken: string;
  user: UserEntity;
}

const Protected = ({ children }: Props) => {
  const setAccessToken = useGlobalStore((state) => state.setAccessToken);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const router = useRouter();

  async function checkAuth() {
    try {
      const res = await Api.get("/auth/refresh/full-data");
      if (res.status == 200) {
        const payload: fullRefreshPayload = res.data.payload;
        if (payload && payload.user) {
          setAccessToken(payload.accessToken);
          Api.setAccessToken(payload.accessToken);
          if (
            !Util.isNotNull(payload?.user?.company_id) &&
            payload.user.user_type !== "super_admin"
          ) {
            router.replace("/home/company/setup");
            payload.user.access_role.role = {
              4: { access: true },
              5: { access: true, add: true, edit: true },
            };
          }
          setUser(payload.user);
        }
      } else {
        toast.error(
          res.data.message || "Authentication failed. Please log in again."
        );
        router.replace("/auth/login");
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      toast.error("Authentication failed. Please log in again.");
      redirect("/auth/login");
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    checkAuth();
  }, []);

  return <>{user?.id ? <>{children}</> : <SplashScreen />}</>;
};

export default Protected;
