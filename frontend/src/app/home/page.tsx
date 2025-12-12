"use client";
import Loader from "@/components/common/loader";
import Api from "@/utils/api";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import useUserStore from "../../store/user-store";
import Util from "@/utils/util";
import { BarChart, PieChart } from "@mui/x-charts";

type Props = {};

type PermissionsType =
  | "access"
  | "board_management"
  | "user_management"
  | "task_management";
// | "analytics";

type DashboardData = {
  board_management: {
    name: string;
    id: number;
    pending_tasks: number;
    total_tasks: number;
    completed_tasks: number;
  }[];
  user_management: {
    _count: number;
    user_type: "manager";
  }[];
  task_management: {
    doneTask: number;
    pendingTask: number;
  };
};

// Page 0
const page = (props: Props) => {
  const User = useUserStore((state) => state.user);
  const permissions = useUserStore((state) =>
    state.getRolePermissions(0)
  ) as Record<PermissionsType, boolean>;
  const [DashboardData, setDashboardData] = useState<DashboardData>(null);
  const [IsLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await Api.get("/common/dashboard");
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
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        Dashboard
      </h1>
      {DashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Distribution */}
          {DashboardData.user_management && (
            <div className="flex flex-col p-5 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm bg-white dark:bg-gray-900 transition-all hover:shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                User Distribution
              </h2>
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: DashboardData.user_management.map((u) => u.user_type),
                  },
                ]}
                series={[
                  {
                    data: DashboardData.user_management.map((u) => u._count),
                    label: "Number of Users",
                    color: "#6366f1", // Indigo
                  },
                ]}
                height={300}
                borderRadius={8}
                grid={{ horizontal: true }}
              />
            </div>
          )}

          {/* Board Management */}
          {DashboardData.board_management && (
            <div className="flex flex-col p-5 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm bg-white dark:bg-gray-900 transition-all hover:shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Board Progress
              </h2>
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: DashboardData.board_management.map((b) => b.name),
                  },
                ]}
                series={[
                  {
                    data: DashboardData.board_management.map(
                      (b) => b.completed_tasks
                    ),
                    label: "Completed",
                    stack: "total",
                    color: "#3b82f6",
                  },
                  {
                    data: DashboardData.board_management.map(
                      (b) => b.pending_tasks
                    ),
                    label: "Pending",
                    stack: "total",
                    color: "#f59e0b",
                  },
                ]}
                height={300}
                borderRadius={8}
                grid={{ horizontal: true }}
              />
            </div>
          )}

          {/* Task Management */}
          {DashboardData.task_management && (
            <div className="flex flex-col p-5 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm bg-white dark:bg-gray-900 transition-all hover:shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Task Status
              </h2>
              <div className="flex-grow flex items-center justify-center">
                <PieChart
                  series={[
                    {
                      data: [
                        {
                          id: 0,
                          value: DashboardData.task_management.pendingTask,
                          label: "Pending",
                          color: "#f59e0b",
                        },
                        {
                          id: 1,
                          value: DashboardData.task_management.doneTask,
                          label: "Done",
                          color: "#3b82f6",
                        },
                      ],
                      highlightScope: { fade: "global", highlight: "item" },
                      faded: {
                        innerRadius: 30,
                        additionalRadius: -30,
                        color: "gray",
                      },
                      innerRadius: 40,
                      paddingAngle: 4,
                      cornerRadius: 6,
                    },
                  ]}
                  height={250}
                  margin={{ top: 0, bottom: 40, left: 10, right: 10 }}
                  slotProps={{
                    legend: {
                      direction: "horizontal",
                      position: { vertical: "bottom", horizontal: "center" },
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default page;
