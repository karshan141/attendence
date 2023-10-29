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
        <div className="w-full">
          <div className="mx-auto w-11/12 max-w-[1250px] min-h-[calc(100vh-144px)]">
            <Outlet />
          </div>
          <div className="h-[64px] bg-[#E6ECEC] flex items-center justify-center">
            <Footer/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashbord;
