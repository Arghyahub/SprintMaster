import AccessRoleEntity, { RoleRowType } from "@/types/entities/role-entity";
import { create } from "zustand";

interface UserStore {
  user?: {
    id: number;
    name: string;
    email: string;
    user_type: string;
    access_role: AccessRoleEntity;
  };
  setUser: (user: UserStore["user"]) => void;
  getRolePermissions: (pageNumber: number) => RoleRowType;
}

const useUserStore = create<UserStore>((set, get) => ({
  user: undefined,
  setUser: (user) => set({ user }),
  getRolePermissions: (num) => get()?.user?.access_role?.role?.[num],
}));

export default useUserStore;
