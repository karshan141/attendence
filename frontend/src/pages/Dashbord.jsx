import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const Dashbord = () => {
  return (
    <div className="flex flex-col bg-[#E6E6E6]">
      <div>
        <Navbar />
      </div>
      <div className="flex min-h-[calc(100vh-64px)] flex-col sm:flex-row">
        <div>
          <Sidebar />
        </div>
        <div className="mx-auto w-11/12 max-w-[1250px] ">
          <Outlet />
        </div>
      </div>
      
    </div>
  );
};

export default Dashbord;
