"use client";
import VariantBtn from "@/components/common/varitant-btn";
import MRTable, { ActionsMenuType } from "@/components/table/MRTable";
import useTableStateManager from "@/components/table/TableStateManagerHook";
import useUserStore from "@/store/user-store";
import UserEntity from "@/types/entities/user-entity";
import Api from "@/utils/api";
import { Edit } from "lucide-react";
import { MRT_ColumnDef } from "material-react-table";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {};

const columns: MRT_ColumnDef<UserEntity>[] = [
  {
    header: "Id",
    accessorKey: "id",
    size: 100,
    meta: { num: true },
  },
  {
    header: "Name",
    accessorKey: "name",
    meta: { text: true },
  },
  {
    header: "Email",
    accessorKey: "email",
    meta: { text: true },
  },
  {
    header: "Role",
    accessorKey: "user_type",
    meta: { eq: true },
  },
];

// Page 7
const page = (props: Props) => {
  const router = useRouter();
  const permissions = useUserStore((state) => state.getRolePermissions(7));
  const [PeopleData, setPeopleData] = useState<UserEntity[]>([]);
  const {
    rowCount,
    setRowCount,
    columnFilters,
    setColumnFilters,
    pagination,
    setPagination,
    sorting,
    setSorting,
    isLoading,
    setIsLoading,
    isRefetching,
    setIsRefetching,
    initTableLoader,
    endTableLoader,
  } = useTableStateManager();

  const actionMenu: ActionsMenuType<UserEntity> = [
    {
      id: 0,
      icon: <Edit className="size-5" />,
      callback: (row) => router.push(`/home/company/people/${row?.id}`),
      hideMenuCb: () => !permissions?.edit,
      label: "Edit",
    },
  ];

  async function getUsers() {
    try {
      const res = await Api.get("/company/people");
      if (res.data.success) {
        setPeopleData(res.data.payload);
      } else {
        toast.message(res.data?.message ?? "Internal server error");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while fetching data");
    }
  }

  useEffect(() => {
    if (!permissions?.access) {
      router.push("/home");
      return;
    }
    getUsers();
  }, [permissions]);

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex flex-row justify-between">
        <h1 className="font-medium text-3xl">Manage People</h1>
        <VariantBtn label="Add People" />
      </div>

      <MRTable
        columns={columns}
        data={PeopleData}
        rowCount={rowCount}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        isLoading={isLoading}
        isRefetching={isRefetching}
        actionsMenu={actionMenu}
      />
    </div>
  );
};

export default page;
