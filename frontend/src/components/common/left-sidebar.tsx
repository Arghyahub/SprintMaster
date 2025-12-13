"use client";
import useUserStore from "@/store/user-store";
import config from "@/config/config";
import MenuList, { MenuItem } from "@/config/menu-list";
import { cn } from "@/lib/utils";
import Util from "@/utils/util";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  EllipsisVertical,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Tooltip } from "react-tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import usePeristStore from "@/store/persist-store";

type Props = {};

function OnMobile() {
  if (Util.isOnServer()) return false;
  return window.innerWidth < 768;
}

type MenuListState = MenuItem & { is_open?: boolean };

const LeftSidebar = (props: Props) => {
  const IsSidebarOpen = usePeristStore(
    (state) => state.isLeftSidebarOpen ?? !OnMobile()
  );
  const setIsSidebarOpen = usePeristStore((state) => state.setLeftSidebarOpen);
  const user = useUserStore((state) => state.user);
  const [MenuListState, setMenuListState] = useState<MenuListState[]>([]);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user.id) return setMenuListState([]);
    const newMenuList = MenuList.getMenuItems(user.access_role.role, pathname);
    console.log("Menu List:", newMenuList);
    setMenuListState(newMenuList);
  }, [user, pathname]);

  const tooltipIds = useMemo(() => {
    return MenuListState.reduce<string[]>((acc, menu) => {
      acc.push(`${menu.id}`);
      if (menu.type === "parent" && menu.children) {
        menu.children.forEach((child) => acc.push(`${child.id}`));
      }
      return acc;
    }, []);
  }, [MenuListState]);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 px-3 py-2 border-r-2 h-full",
        IsSidebarOpen ? "w-[250px]" : "w-[70px]"
      )}
    >
      <div
        className={cn(
          "flex flex-row items-center w-full",
          IsSidebarOpen ? "" : "flex-col-reverse"
        )}
      >
        {IsSidebarOpen && <div className="w-1/4"></div>}
        <div
          className={cn(
            "flex flex-col items-center gap-2 pb-4 border-b-4",
            IsSidebarOpen ? "px-2 pt-2" : "mt-2"
          )}
        >
          <Image
            src={config.logo}
            alt="Logo"
            width={70}
            height={70}
            className={cn(IsSidebarOpen ? "" : "size-14")}
          />
          <h1
            className={cn("text-xl", IsSidebarOpen ? "" : "text-base hidden")}
          >
            {config.title}
          </h1>
        </div>

        <button
          onClick={() => setIsSidebarOpen(!IsSidebarOpen)}
          className={cn(
            "bg-teal-500 hover:bg-teal-600 p-1 rounded-full text-white text-center transition cursor-pointer",
            IsSidebarOpen ? "ml-auto" : "mt-4"
          )}
        >
          {IsSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      <div className="flex flex-col gap-2 pb-2 w-full h-full overflow-y-scroll no-scrollbar">
        {MenuListState.map((menu) => (
          <div key={menu.id} className="flex flex-col gap-2 w-full">
            {menu.type === "link" ? (
              <>
                <Link
                  href={menu.path}
                  data-tooltip-id={`${menu.id}`}
                  data-tooltip-content={menu.title}
                  className={cn(
                    "flex flex-row items-center gap-2 hover:bg-teal-100 rounded-md hover:text-teal-800 transition duration-400 cursor-pointer",
                    IsSidebarOpen ? "px-5 py-4" : "justify-center py-2",
                    pathname === menu.path
                      ? "bg-teal-100 text-teal-800 shadow-md"
                      : ""
                  )}
                >
                  <menu.icon className="size-5" />
                  {IsSidebarOpen && <div className="flex-1">{menu.title}</div>}
                </Link>
              </>
            ) : (
              <>
                <button
                  data-tooltip-id={`${menu.id}`}
                  data-tooltip-content={menu.title}
                  onClick={() => {
                    setMenuListState((prev) =>
                      prev.map((m) =>
                        m.id === menu.id ? { ...m, is_open: !m.is_open } : m
                      )
                    );
                  }}
                  className={cn(
                    "flex flex-row items-center hover:bg-teal-100 rounded-md hover:text-teal-800 transition duration-400 cursor-pointer",
                    IsSidebarOpen ? "px-5 py-4 gap-2" : "justify-center py-2"
                  )}
                >
                  <menu.icon
                    className={cn("size-5", IsSidebarOpen ? "" : "ml-3")}
                  />
                  {IsSidebarOpen && <div className="">{menu.title}</div>}
                  <ChevronDown
                    className={cn(IsSidebarOpen ? "ml-auto size-5" : "size-3")}
                  />
                </button>
              </>
            )}
            {menu.is_open && menu.type == "parent" && (
              <div className="flex flex-col gap-2 w-full animate-fade-elongate">
                {menu.children.map((child) => (
                  <Link
                    key={child.id}
                    href={child.path}
                    data-tooltip-id={`${child.id}`}
                    data-tooltip-content={child.title}
                    className={cn(
                      "flex flex-row items-center gap-2 hover:bg-cyan-100 rounded-md hover:text-cyan-800 transition duration-400 cursor-pointer",
                      IsSidebarOpen ? "px-5 py-4 pl-12" : "justify-center py-2",
                      pathname === child.path
                        ? "bg-teal-100 text-teal-800 shadow-md"
                        : ""
                    )}
                  >
                    {!IsSidebarOpen && <child.icon className="size-5" />}
                    {IsSidebarOpen && (
                      <div className="flex-1">{child.title}</div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {tooltipIds.map((id) => (
        <Tooltip
          key={id}
          id={id}
          place="right"
          style={{
            color: "white",
            background: "teal",
            fontSize: "0.7rem",
            padding: "0.2rem 0.4rem",
            zIndex: 1,
            maxWidth: "200px",
            ...(!IsSidebarOpen ? {} : { display: "none" }),
          }}
        />
      ))}

      <div
        className={cn(
          "flex flex-row items-center gap-2 mb-2 px-3 py-2 border border-slate-500 rounded-md w-full",
          { "p-1 justify-center": !IsSidebarOpen }
        )}
      >
        {IsSidebarOpen && (
          <>
            <CircleUser />
            <div className="flex flex-col mr-auto">
              <p className="text-sm">{user?.name}</p>
              <p className="text-xs">{user?.email}</p>
            </div>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:border-0focus:ring-0">
            {IsSidebarOpen ? (
              <EllipsisVertical className="size-5" />
            ) : (
              <CircleUser className="size-5" />
            )}
            {/* EllipsisVertical className="size-5" /> */}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={Util.logout}>Logout</DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => router.push("/home/profile")}>
              Profile
            </DropdownMenuItem> */}
            {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default LeftSidebar;
