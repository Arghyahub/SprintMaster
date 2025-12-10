"use client";
import Loader from "@/components/common/loader";
import VariantBtn from "@/components/common/varitant-btn";
import useUserStore from "@/store/user-store";
import BoardEntity from "@/types/entities/board=entity";
import Api from "@/utils/api";
import Util from "@/utils/util";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { PieChart } from "@mui/x-charts/PieChart";
import { EllipsisVertical, Settings, Settings2 } from "lucide-react";

const data = [
  { label: "Group A", value: 400 },
  { label: "Group B", value: 300 },
  { label: "Group C", value: 300 },
  { label: "Group D", value: 200 },
];

type Props = {};

// Page 6
const page = (props: Props) => {
  const permissions = useUserStore((state) => state.getRolePermissions(6));
  const [IsLoading, setIsLoading] = useState(false);
  const [Data, setData] = useState<BoardEntity[]>([]);
  const router = useRouter();

  const fetchBoards = async () => {
    setIsLoading(true);
    try {
      const res = await Api.get("/board");
      if (res.status == 500) {
        toast.error(res.data.message ?? "Something went wrong");
      } else if (res.status == 200 && res.data?.payload) {
        setData(res.data.payload);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch boards.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!permissions.access) {
      return Util.logout();
    }
    fetchBoards();
  }, []);

  if (IsLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row justify-between w-full">
        <h1 className="text-3xl  mb-2">Boards</h1>
        <VariantBtn
          label="Create Board"
          onClick={() => router.push("/home/board/add-update")}
        />
      </div>

      {Data.length === 0 ? (
        <p>No boards available. Create one today</p>
      ) : (
        <div className="flex flex-row flex-wrap gap-6 w-full h-full">
          {Data.map((board) => (
            <div key={board.id} className="relative ">
              <Link
                href={`/home/board/add-update/${board.id}`}
                className="absolute top-5 right-5 hover:text-teal-700 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <Settings2 />
              </Link>
              <Link
                href={`/home/board/view/${board.id}`}
                className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-slate-100"
              >
                <PieChart
                  series={[
                    {
                      startAngle: -90,
                      endAngle: 90,
                      paddingAngle: 5,
                      innerRadius: "60%",
                      outerRadius: "150%",
                      data: [
                        {
                          label: `Completed Tasks ${(
                            ((board?.completed_tasks ?? 0) /
                              (board?.total_tasks ?? 1)) *
                            100
                          ).toFixed(2)}%`,
                          value: board?.completed_tasks ?? 0,
                          color: "#00c951",
                        },
                        {
                          label: `Pending Tasks ${(
                            ((board?.pending_tasks ?? 0) /
                              (board?.total_tasks ?? 1)) *
                            100
                          ).toFixed(2)}%`,
                          value: board?.pending_tasks ?? 0,
                          color: "#ffba00",
                        },
                        ...(board?.total_tasks == 0 && board?.pending_tasks == 0
                          ? [
                              {
                                label: `No Tasks created`,
                                value: 1,
                                color: "#2b7fff",
                              },
                            ]
                          : []),
                      ],
                      cy: "85%",
                    },
                  ]}
                  hideLegend
                />
                <p className="text-xl font-medium text-teal-900">
                  {board.name}
                </p>
                {/* <p>{board.name}</p>
              <div className="border w-full"></div>
              <div className="flex flex-row justify-between">
                <table>
                  <tr>
                    <td className="pr-2">Pending Tasks:</td>
                    <td>{board?.pending_tasks ?? ""}</td>
                    <td>/</td>
                    <td>{board?.total_tasks ?? ""}</td>
                  </tr>
                  <tr>
                    <td className="pr-2">Completed Tasks:</td>
                    <td>{board?.completed_tasks ?? ""}</td>
                    <td>/</td>
                    <td>{board?.total_tasks ?? ""}</td>
                  </tr>
                </table>
              </div> */}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default page;
