"use client";
import useUserStore from "@/store/user-store";
import VariantBtn from "@/components/common/varitant-btn";
import MRTable, { ActionsMenuType } from "@/components/table/MRTable";
import useTableStateManager from "@/components/table/TableStateManagerHook";
import AccessRoleEntity from "@/types/entities/role-entity";
import Api from "@/utils/api";
import { Edit } from "lucide-react";
import { MRT_ColumnDef } from "material-react-table";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Props = {};

const columns: MRT_ColumnDef<AccessRoleEntity>[] = [
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
    header: "Master",
    accessorKey: "is_master",
    accessorFn: (row) => (row?.is_master ? "Master" : "Custom"),
    meta: { text: true },
  },
  {
    header: "For Role",
    accessorKey: "for_type",
    accessorFn: (row) => {
      if (typeof row?.for_type == "string")
        return row?.for_type?.replaceAll("_", " ");
      else "";
    },
    filterVariant: "multi-select",
    filterSelectOptions: [
      { label: "Super Admin", value: "super_admin" },
      { label: "Admin", value: "admin" },
      { label: "Manager", value: "manager" },
      { label: "Employee", value: "employee" },
    ],
    meta: { multi: true },
  },
  {
    header: "Created at",
    accessorKey: "created_at",
    Cell: ({ cell }) => {
      const row = cell?.row?.original?.created_at;
      if (!row) return "";
      const date = new Date().toLocaleString();
      return date;
    },
    size: 250,
    meta: { eq: true },
  },
  {
    header: "Updated at",
    accessorKey: "updated_at",
    Cell: ({ cell }) => {
      const row = cell?.row?.original?.updated_at;
      if (!row) return "";
      const date = new Date().toLocaleString();
      return date;
    },
    size: 250,
    meta: { eq: true },
  },
  {
    header: "Updated by",
    accessorKey: "updated_by_user.name",
    meta: { text: true },
    accessorFn: (row) => row?.updated_by_user?.name ?? "",
  },
];

// Page 3
const page = (props: Props) => {
  const router = useRouter();
  const [AccessRoleData, setAccessRoleData] = useState<AccessRoleEntity[]>([]);
  const permissions = useUserStore((state) => state.getRolePermissions(3));
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

  const actionMenu: ActionsMenuType<AccessRoleEntity> = [
    {
      id: 0,
      icon: <Edit className="size-5" />,
      callback: (row) =>
        router.push(`/home/super-admin/role/add-update/${row?.id}`),
      hideMenuCb: () => !permissions?.edit,
      label: "Edit",
    },
  ];

  async function getList() {
    try {
      initTableLoader();
      console.log(columnFilters);
      const query = {
        columnFilters,
        sorting,
        pagination,
      };
      const res = await Api.get("/admin/role", query);

      if (res.status == 200) {
        const payload = res.data.payload;
        setAccessRoleData(payload);
      } else if (res.status == 401) {
        toast.error("Unauthorized");
        router.push("/login");
      } else {
        toast.error(res.data.message || "Failed to fetch list");
      }
    } catch (error) {
      console.error("Error fetching list:", error);
      toast.error("Failed to fetch list");
    } finally {
      endTableLoader();
    }
  }

  useEffect(() => {
    if (!permissions?.access) {
      toast.error("Not authorized");
      router.push("/home");
      return;
    }
    getList();
  }, [columnFilters, sorting, pagination, permissions]);

  // if (isLoading) {
  //   return <Loader />;
  // }

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="mb-2 font-semibold text-2xl">Roles</h1>
        {permissions?.add && (
          <VariantBtn
            label="Add"
            onClick={() => router.push("/home/super-admin/role/add-update")}
          />
        )}
      </div>
      <MRTable
        columns={columns}
        data={AccessRoleData}
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
