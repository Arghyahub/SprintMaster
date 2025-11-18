"use client";
import Loader from "@/components/common/loader";
import Api from "@/utils/api";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import useUserStore from "../../store/user-store";
import Util from "@/utils/util";

type Props = {};

type PermissionsType =
  | "access"
  | "board_management"
  | "user_management"
  | "pending_tasks";
// | "analytics";

// Page 0
const page = (props: Props) => {
  const User = useUserStore((state) => state.user);
  const permissions = useUserStore((state) =>
    state.getRolePermissions(0)
  ) as Record<PermissionsType, boolean>;
  const [DashboardData, setDashboardData] = useState({
    board_data: null,
    user_data: null,
    task_data: null,
    // analytics_data: null,
  });
  const [IsLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await Api.get("/company/dashboard");
      if (res.status == 200) {
        const data = res?.data?.payload;
        if (data) {
          console.log("Dashboard Data:", data);
          setDashboardData(data);
        }
      } else {
        toast.error(res.data?.message || "Failed to fetch dashboard data.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!Util.isNotNull(User?.company_id) && User.user_type !== "super_admin") {
      router.replace("/home/company/setup");
      return;
    }
    fetchDashboardData();
  }, []);

  if (IsLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl">Dashboard</h1>
      {permissions?.board_management && <p>board_management</p>}
      {permissions?.pending_tasks && <p>pending_tasks</p>}
      {permissions?.user_management && <p>user_management</p>}
    </div>
  );
};

export default page;
