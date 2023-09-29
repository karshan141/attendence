// src/components/Sidebar.js

import React, { useState } from "react";
import { MdExpandMore } from "react-icons/md";
import { BiUserPlus, BiSolidTime, BiSolidDashboard } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import { FcLeave } from "react-icons/fc";

const SubmenuItem = ({ label, subitemsLinks }) => (
  <li className="text-[#A9038D] font-semibold  py-1 px-4 rounded-lg tracking-tighter hover:bg-[#E6E6E6] hover:text-[#16639F]">
    <NavLink to={subitemsLinks}>{label}</NavLink>
  </li>
);

const MenuItem = ({
  label,
  icon,
  subitems,
  subitemsLinks,
  openMenu,
  setOpenMenu,
}) => {
  const isOpen = openMenu === label;

  const toggleSubMenu = () => {
    if (isOpen) {
      setOpenMenu(null); // Close the open menu
    } else {
      setOpenMenu(label); // Open this menu
    }
  };

  return (
    <div>
      <div
        onClick={toggleSubMenu}
        className="flex cursor-pointer text-white justify-between gap-2 text-xl p-4 border-b-[1px] font-semibold opacity-80 hover:bg-[#EAECF4] hover:text-[#20467D]"
      >
        <span className="flex items-center gap-2">
          <p className="text-xl">{icon}</p>
          <p>{label}</p>
        </span>
        <span
          className={`transform ${
            isOpen ? "rotate-0" : "-rotate-90"
          } transition-transform`}
        >
          <MdExpandMore />
        </span>
      </div>
      {isOpen && (
        <div>
          <ul className="bg-[#fff] m-4 rounded-lg flex flex-col justify-left text-left p-4 ">
            {subitems.map((subitem, index) => (
              <SubmenuItem
                key={index}
                label={subitem}
                subitemsLinks={subitemsLinks[index]}
              />
            ))}
          </ul>
          <div className="border-b-[1px]"></div>
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);

  return (
    <div className="h-full w-64 bg-gradient-to-b from-[#283367] to-[#0887C8]">
      <div className="flex text-white items-center gap-2 text-xl p-4 border-b-[1px] font-semibold opacity-80">
        <BiSolidDashboard />
        <NavLink to="/">
          <h2>Dashboard</h2>
        </NavLink>
      </div>

      <div></div>
      <MenuItem
        label="Employee"
        icon=<BiUserPlus />
        subitems={["Add Category", "Add Employee", "View Employee"]}
        subitemsLinks={[
          "/addemployeecategory",
          "/addemployee",
          "/viewemployee",
        ]}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
      />
      <MenuItem
        label="Attendence"
        subitems={["Add Attendence", "Attendence Muster", "View EmplyeeWise","Edit Attendence"]}
        subitemsLinks={[
          "/addattendence",
          "/showattendence",
          "/showemployeeattendence",
          "/editemployeeattendence",
        ]}
        icon=<BiSolidTime />
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
      />
      <MenuItem
        label="Off Holiday"
        subitems={["Add Off", "Add PaidHoliday"]}
        subitemsLinks={["/addoffday","/paidholiday"]}
        icon=<FcLeave />
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
      />
    </div>
  );
};

export default Sidebar;
