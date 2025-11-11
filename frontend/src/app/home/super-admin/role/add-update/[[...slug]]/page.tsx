"use client";
import useUserStore from "@/store/user-store";
import AdvInput from "@/components/common/adv-input";
import Loader from "@/components/common/loader";
import MiniLoader from "@/components/common/mini-loader";
import MenuUtil, { MenuItem } from "@/config/menu-list";
import AccessRoleEntity from "@/types/entities/role-entity";
import Api from "@/utils/api";
import Util from "@/utils/util";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdvSelect from "@/components/common/adv-select";

type Props = {};

type AccessCheckType = {
  masterIdx: number;
  childIdx?: number;
  permIdx: number;
  isChecked: boolean;
};

const forOptions = [
  { label: "Admin", value: "admin" },
  { label: "Super Admin", value: "super_admin" },
  { label: "Manager", value: "manager" },
  { label: "Employee", value: "employee" },
];

// Page 3 - add/edit
const page = (props: Props) => {
  const { slug } = useParams();
  const permissions = useUserStore((state) => state.getRolePermissions(3));
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [AccessRoleData, setAccessRoleData] = useState(MenuUtil.getSelectables);
  const [RoleName, setRoleName] = useState({ value: "", error: "" });
  const [ForType, setForType] = useState({ value: "", error: "" });

  const isEditing = useMemo(
    () => slug?.[0] && Number.isInteger(Number(slug?.[0])),
    [slug]
  );

  async function getData(id: number) {
    try {
      setIsLoading(true);
      const res = await Api.get("/admin/role", { id });
      if (res.status == 200) {
        const payload = res.data.payload?.[0] as AccessRoleEntity;
        if (!payload) toast.error("Access role not found");
        else {
          setRoleName({ value: payload?.name, error: "" });
          const clonedData = structuredClone(AccessRoleData);
          const copyRole = clonedData.map((par) => {
            const parent = { ...par };
            if (parent.type == "link") {
              parent.permissions = parent.permissions.map((perm) => ({
                ...perm,
                isChecked: Boolean(payload?.role?.[parent.id]?.[perm.label]),
              }));
            } else {
              parent.children = parent.children.map((child) => ({
                ...child,
                permissions: child.permissions.map((perm) => ({
                  ...perm,
                  isChecked: Boolean(payload?.role?.[child.id]?.[perm.label]),
                })),
              }));
            }
            return parent;
          });
          setAccessRoleData(copyRole);
        }
      } else if (res.status == 401) {
        toast.error("Unauthorized");
        router.push("/login");
      } else {
        toast.error(res.data.message || "Failed to fetch list");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  async function setAccessChecked({
    masterIdx,
    childIdx,
    permIdx,
    isChecked,
  }: AccessCheckType) {
    if (masterIdx == 0 && permIdx == 0) return;
    const copyState = structuredClone(AccessRoleData);
    const masterItem = copyState[masterIdx];
    if (Util.isNotNull(childIdx)) {
      if (masterItem?.children?.[childIdx]?.permissions?.[permIdx])
        masterItem.children[childIdx].permissions[permIdx].isChecked =
          isChecked;
    } else {
      if (masterItem?.permissions?.[permIdx])
        masterItem.permissions[permIdx].isChecked = isChecked;
    }
    setAccessRoleData(copyState);
  }

  const onRoleNameChange = (value: string): boolean => {
    setRoleName({
      value: value,
      error: Util.isNotNull(value) ? "" : "Role name cannot be empty",
    });
    return Util.isNotNull(value);
  };

  const onForTypeChange = (value: string): boolean => {
    setForType({
      value: value,
      error: Util.isNotNull(value) ? "" : "Role type cannot be empty",
    });
    return isEditing ? true : Util.isNotNull(value);
  };

  async function handleSubmit() {
    const isValid = [
      onRoleNameChange(RoleName.value),
      onForTypeChange(ForType.value),
    ].every(Boolean);

    if (!isValid) return;
    try {
      setIsSubmitting(true);
      const roleFmt = {};
      AccessRoleData.forEach((master) => {
        if (master.type == "link") {
          roleFmt[master.id] = {};
          master.permissions.forEach((perm) => {
            roleFmt[master.id][perm.label] = perm.isChecked;
          });
        } else {
          master.children.forEach((child) => {
            roleFmt[child.id] = {};
            child.permissions.forEach((perm) => {
              roleFmt[child.id][perm.label] = perm.isChecked;
            });
          });
        }
      });
      roleFmt[0].access = true;

      const data = {
        id: isEditing ? Number(slug?.[0]) : null,
        name: RoleName.value,
        role: roleFmt,
        for_type: isEditing ? null : ForType.value,
      };

      const res = await Api.post("/admin/role/add-update", data);
      if (res.status == 401) {
        Util.logout();
        return;
      } else if (res.status >= 200 && res.status < 400) {
        toast.success("Role updated successfully");
        // router.push("/home/super-admin/role");
        window.location.href = "/home/super-admin/role"; // to reload data
      } else {
        toast.error(res.data?.message ?? "An error occurred");
      }
    } catch (error) {
      console.log("error ", error);
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (!permissions?.edit && isEditing) {
      router.push("/home");
      return;
    }
    if (!permissions?.add && !isEditing) {
      router.push("/home");
      return;
    }
    if (isEditing) getData(Number(slug?.[0]));
  }, [isEditing, permissions]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-2xl">
        {isEditing ? "Update access role" : "Add access role"}
      </h1>
      <div className="flex flex-row gap-4 w-full">
        <div className="mb-2 w-64">
          <AdvInput
            label="Role Name"
            className="w-full"
            placeholder="Enter role name"
            value={RoleName.value}
            onChange={(e) => onRoleNameChange(e.target.value)}
            error={RoleName.error}
            id="role-name"
          />
        </div>
        {permissions?.add && !isEditing && (
          <div className="mb-2 w-64">
            <AdvSelect
              label="Role for"
              placeholder="Enter role for"
              className="w-full"
              value={ForType.value}
              onChange={(value) => onForTypeChange(value)}
              error={ForType.error}
              id="for-role"
              options={forOptions}
            />
          </div>
        )}
      </div>
      {AccessRoleData.map((parent, parIdx) => (
        <div
          key={parent.id}
          className="flex flex-col bg-slate-50 p-4 border-2 border-slate-200 rounded-lg w-full"
        >
          {parent.type == "link" ? (
            <div className="flex flex-col gap-2">
              <label className="flex flex-row gap-2 font-medium text-xl">
                {/* <input type="checkbox" /> */}
                <p>{parent.label}</p>
              </label>

              <div className="flex flex-row gap-6">
                {parent.permissions?.map((perm, idx) => (
                  <label
                    key={`${parent.id}-child-${idx}`}
                    className="flex flex-row gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={perm.isChecked || (parIdx == 0 && idx == 0)}
                      disabled={parIdx == 0 && idx == 0}
                      onChange={(e) =>
                        setAccessChecked({
                          masterIdx: parIdx,
                          permIdx: idx,
                          isChecked: e.target.checked,
                        })
                      }
                    />
                    <p>{perm.label?.replaceAll("_", " ")}</p>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h4 className="font-medium text-xlum text-xl">{parent.label}</h4>

              {parent.children.map((child, chIdx) => (
                <div key={child.id} className="flex flex-col gap-1 w-full">
                  <label className="flex flex-row gap-2">
                    {/* <input type="checkbox" /> */}
                    <p>{child.label}</p>
                  </label>
                  <div className="flex flex-row gap-6">
                    {child.permissions.map((perm, idx) => (
                      <label
                        key={`${child.id}-child-${idx}`}
                        className="flex flex-row gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={perm.isChecked}
                          onChange={(e) =>
                            setAccessChecked({
                              masterIdx: parIdx,
                              childIdx: chIdx,
                              permIdx: idx,
                              isChecked: e.target.checked,
                            })
                          }
                        />
                        <p>{perm.label?.replaceAll("_", " ")}</p>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="flex flex-row justify-end w-full">
        <button
          type="submit"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="flex justify-center items-center bg-teal-600 hover:bg-teal-700 p-2 rounded min-w-32 min-h-10 text-white transition duration-300"
        >
          {isSubmitting ? (
            <MiniLoader className="size-5" />
          ) : (
            <>{isEditing ? "Update role" : "Add role"}</>
          )}
        </button>
      </div>
    </div>
  );
};

export default page;
