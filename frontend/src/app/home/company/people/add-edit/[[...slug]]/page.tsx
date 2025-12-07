"use client";
import AdvInput from "@/components/common/adv-input";
import AdvSelect from "@/components/common/adv-select";
import Loader from "@/components/common/loader";
import VariantBtn from "@/components/common/varitant-btn";
import UserEntity from "@/types/entities/user-entity";
import Api from "@/utils/api";
import Util from "@/utils/util";
import Validator from "@/utils/validator";
import { Eye, EyeOff } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Props = {};
const defaultUser = new UserEntity();

const page = (props: Props) => {
  const { slug } = useParams();
  const router = useRouter();
  const [UserState, setUserState] = useState(defaultUser);
  const [AccessRoles, setAccessRoles] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [IsSubmititng, setIsSubmititng] = useState(false);
  const [ShowPassword, setShowPassword] = useState(false);

  const editingId = useMemo(
    () => (Util.isNotNull(slug?.[0]) ? Number(slug[0]) : null),
    [slug]
  );

  async function fetchRoles() {
    try {
      const res = await Api.get("/company/roles");
      const roles = res.data?.payload ?? [];
      if (res.data.success) {
        setAccessRoles(
          roles.map((role) => ({ label: role.name, value: role.id }))
        );
      } else {
        toast.error(res.data?.message ?? "Server error occurred");
      }
    } catch (error) {
      console.log("error : ", error);
    }
  }

  function handleNameChange(value: string) {
    const copyState = { ...UserState };
    copyState.name = value;
    copyState.name_error = "";
    if (!Util.isNotNull(value)) copyState.name_error = "Name cannot be empty";
    setUserState(copyState);
    return copyState.name_error == "";
  }
  function handlePasswordChange(value: string) {
    const copyState = { ...UserState };
    copyState.password = value;
    copyState.password_error = "";
    if (!Util.isNotNull(value))
      copyState.password_error = "password cannot be empty";
    else if (!Validator.isValidPassword(value))
      copyState.password_error =
        "Password must be 8 character with 1 uppercase, 1 special character and a number";
    setUserState(copyState);
    return copyState.password_error == "" || editingId;
  }

  function handleEmailChange(val: string = "") {
    const value = val.trim();
    const copyState = { ...UserState };
    copyState.email = value;
    copyState.email_error = "";
    if (!Util.isNotNull(value)) copyState.email_error = "Email cannot be empty";
    else if (!Validator.isValidEmail(value))
      copyState.email_error = "Not a valid email format";
    setUserState(copyState);
    return copyState.email_error == "";
  }

  function handleRoleChange(val: any) {
    const copyState = { ...UserState };
    copyState.access_role_id = val;
    copyState.access_role_id_error = "";
    if (!Util.isNotNull(val))
      copyState.access_role_id_error = "Role is a required field";
    setUserState(copyState);
    return copyState.access_role_id_error == "";
  }

  async function getUserData() {
    try {
      const res = await Api.get(`/company/people/${editingId}`);
      if (res.data.success) {
        setUserState(res.data?.payload ?? defaultUser);
      } else {
        toast.error(
          res.data.message ?? "Server error while fetching user data"
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to fetch user data");
    }
  }

  const handleSubmit = async () => {
    const validation = [
      handleNameChange(UserState.name),
      handleEmailChange(UserState.email),
      handleRoleChange(UserState.access_role_id),
      handlePasswordChange(UserState?.password),
    ].every(Boolean);
    if (!validation) return;

    const role = AccessRoles.find(
      (role) => role.value == UserState.access_role_id
    );

    try {
      setIsSubmititng(true);
      const payload = {
        id: editingId,
        name: UserState.name,
        email: UserState.email,
        role_id: UserState.access_role_id,
        password: UserState.password,
        user_type: role.value == "Manager" ? "manager" : "employee",
      };

      const res = await Api.post("/company/people/update", payload);

      if (res.data.success) {
        toast.success("User updated succesfully");
        router.push("/home/company/people");
        return;
      } else {
        toast.error(res.data?.message ?? "Internal server error");
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to update user data");
    } finally {
      setIsSubmititng(false);
    }
  };

  useEffect(() => {
    (async () => {
      const fr = fetchRoles();
      const fp = Util.isNotNull(editingId) ? getUserData() : null;

      setIsLoading(true);
      await Promise.allSettled([fr, fp]);
      setIsLoading(false);
    })();
  }, [editingId]);

  if (IsLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <h1 className="font-medium text-3xl mb-2">
        {editingId ? "Edit User" : "Add User"}
      </h1>

      <div className="flex flex-row flex-wrap gap-6">
        <AdvInput
          label="Name *"
          value={UserState.name}
          error={UserState.name_error}
          id="user_name"
          placeholder="Enter name"
          onChange={(e) => handleNameChange(e.target.value)}
        />
        <AdvInput
          label="Email *"
          type="text"
          value={UserState.email}
          error={UserState.email_error}
          id="user_email"
          placeholder="Enter email"
          onChange={(e) => handleEmailChange(e.target.value)}
        />
        <AdvSelect
          label="Role *"
          placeholder="Select Role"
          options={AccessRoles}
          value={UserState.access_role_id}
          error={UserState.access_role_id_error}
          id="user_role"
          onChange={handleRoleChange}
        />
        {!Util.isNotNull(editingId) && (
          <AdvInput
            type={ShowPassword ? "text" : "password"}
            label="Password *"
            value={UserState.password}
            error={UserState.password_error}
            id="user_password"
            placeholder="Enter password"
            onChange={(e) => handlePasswordChange(e.target.value)}
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
        )}
      </div>
      <div className="flex mt-2">
        <VariantBtn
          onClick={handleSubmit}
          label="Submit"
          classname="ml-auto mr-5 xl:mr-20"
          isLoading={IsSubmititng}
        />
      </div>
    </div>
  );
};

export default page;
