import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const Dashbord = () => {
  return (
    <div className="flex flex-col">
      <div>
        <Navbar />
      </div>
      <div className="flex min-h-[calc(100vh-64px)] ">
        <div>
          <Sidebar />
        </div>
        <div className="mx-auto w-11/12 max-w-[1250px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashbord;
