import React from "react";
import LeftSidebar from "./left-sidebar";
import MobileSidebar from "./mobile-sidebar";

type Props = {};

const Sidebar = (props: Props) => {
  return (
    <>
      <div className="hidden sm:block">
        <LeftSidebar />
      </div>
      <div className="sm:hidden block">
        <MobileSidebar />
      </div>
    </>
  );
};

export default Sidebar;
