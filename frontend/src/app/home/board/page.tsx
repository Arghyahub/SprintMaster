"use client";
import Loader from "@/components/common/loader";
import useUserStore from "@/store/user-store";
import Api from "@/utils/api";
import Util from "@/utils/util";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {};

// Page 6
const page = (props: Props) => {
  const permissions = useUserStore((state) => state.getRolePermissions(6));
  const [IsLoading, setIsLoading] = useState(false);
  const [Data, setData] = useState([]);

  const fetchBoards = async () => {
    setIsLoading(true);
    try {
      const res = await Api.get("/board");
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
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl">Boards</h1>
    </div>
  );
};

export default page;
