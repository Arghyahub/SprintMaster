"use client";
import Loader from "@/components/common/loader";
import Api from "@/utils/api";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import useUserStore from "../../store/user-store";
import Util from "@/utils/util";

type Props = {};

// Page 0
const page = (props: Props) => {
  const User = useUserStore((state) => state.user);
  const permissions = useUserStore((state) => state.getRolePermissions(0));
  const [DashboardData, setDashboardData] = useState({
    board_data: null,
    user_data: null,
    task_data: null,
    analytics_data: null,
  });
  const router = useRouter();

  useEffect(() => {
    // if (!Role?.access) {
    //   Util.logout();
    //   return;
    // }
    if (!Util.isNotNull(User?.company_id) && User.user_type !== "super_admin") {
      router.replace("/home/company/setup");
    }
  }, []);

  // if (IsLoading) {
  //   return <Loader />;
  // }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl">Dashboard</h1>
      {permissions?.board_management && (
        <p>If you are super admin and you have access then you can see it</p>
      )}
    </div>
  );
};

export default page;
