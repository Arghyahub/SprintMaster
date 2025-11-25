"use client";
import { JSX } from "react";
import {
  BriefcaseBusiness,
  House,
  LayoutDashboard,
  ScanFace,
  Settings,
  User,
  UserStar,
} from "lucide-react";
import config from "./config";
import { RoleEntity } from "@/types/entities/role-entity";

export type ParentMenuItem = {
  type: "parent"; // Only used to show is menu, no real use
  title: string;
  icon: JSX.ElementType;
  id: number;
  children: {
    // Holds actual use
    title: string;
    id: number;
    icon: JSX.ElementType;
    path: string;
    access: string[];
  }[];
};

export type LinkMenuItem = {
  type: "link";
  title: string;
  icon: JSX.ElementType;
  id: number;
  path: string;
  access: string[];
};

export type MenuItem = ParentMenuItem | LinkMenuItem;

class MenuUtil {
  // This will decide whether to enable role-based access or not
  static role_access_enabled = config.enable_role_based_access;

  static validateUniqueIds() {
    const usedIds = new Set<number>();
    for (const item of this.MenuItems) {
      if (usedIds.has(item.id)) {
        throw new Error(`Duplicate ID found in MenuItems: ${item.id}`);
      }
      usedIds.add(item.id);
      if (item.type == "link") continue;
      for (const child of item.children || []) {
        if (usedIds.has(child.id)) {
          throw new Error(`Duplicate ID found in child items: ${child.id}`);
        }
        usedIds.add(child.id);
      }
    }
  }

  static getMenuItems(
    access_role: RoleEntity,
    currentPath?: string
  ): (MenuItem & { is_open?: boolean })[] {
    const CompleteMenuItems = MenuUtil.cloneMenuItems();
    if (!this.role_access_enabled) {
      return CompleteMenuItems;
    }

    const newMenuList = CompleteMenuItems.filter((menu) => {
      if (!access_role?.[menu.id]?.access && menu.type == "link") return false;
      if (menu.type == "link") return true;
      menu.children = menu.children.filter((child) => {
        return access_role?.[child.id]?.access;
      });
      return menu.children.length > 0;
    }) as (MenuItem & { is_open?: boolean })[];

    const parent = newMenuList.find((menu) => {
      if (menu.type == "link") return false;
      return menu.children.some((child) => child.path === currentPath);
    });

    if (parent) {
      parent.is_open = true;
    }

    return newMenuList;
  }

  static getSelectables(menuItems?: typeof MenuUtil.MenuItems) {
    let menuItemList = menuItems;
    if (!menuItemList) {
      menuItemList = MenuUtil.cloneMenuItems();
    }

    const selectables = menuItemList.map((menu) => {
      if (menu.type == "link") {
        return {
          id: menu.id,
          type: menu.type,
          label: menu.title,
          permissions: menu.access.map((acc) => ({
            label: acc,
            isChecked: false,
          })),
        };
      } else {
        const children = menu.children.map((child) => ({
          id: child.id,
          label: child.title,
          permissions: child.access.map((acc) => ({
            label: acc,
            isChecked: false,
          })),
        }));

        return {
          id: menu.id,
          type: menu.type,
          label: menu.title,
          children: children,
        };
      }
    });
    return selectables;
  }

  static cloneMenuItems(): typeof MenuUtil.MenuItems {
    return MenuUtil.MenuItems.map((menu) => {
      if (menu.type == "link") {
        return { ...menu, access: [...menu.access] };
      } else {
        return {
          ...menu,
          children: menu.children.map((child) => ({
            ...child,
            access: [...child.access],
          })),
        };
      }
    });
  }

  static MenuItems: MenuItem[] = [
    {
      id: 0,
      title: "Dashboard",
      icon: House,
      type: "link",
      path: "/home",
      access: [
        "access",
        "board_management",
        "user_management",
        "pending_tasks",
        // "analytics",
      ],
    },
    // Super Admin is Number 1.
    {
      id: 1,
      title: "Super Admin",
      icon: UserStar,
      type: "parent",
      children: [
        {
          id: 2,
          title: "Users",
          icon: User,
          path: "/home/super-admin/user",
          access: ["access"],
        },
        {
          id: 3,
          title: "Role",
          icon: ScanFace,
          path: "/home/super-admin/role",
          access: ["access", "add", "edit"],
        },
      ],
    },
    // Company Setup
    {
      id: 4,
      title: "Company",
      type: "parent",
      icon: BriefcaseBusiness,
      children: [
        {
          id: 5,
          title: "Setup",
          icon: Settings,
          path: "/home/company/setup",
          access: ["access", "add", "edit"],
        },
      ],
    },
    {
      id: 6,
      title: "Boards",
      icon: LayoutDashboard,
      type: "link",
      path: "/home/board",
      access: ["access", "add", "view"],
    },
  ] as const;
}
// Update this variable to the last ID used in your menu items
const lastId = 6 as const;

MenuUtil.validateUniqueIds();

export default MenuUtil;
