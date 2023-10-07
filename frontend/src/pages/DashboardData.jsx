import React, { useEffect, useState } from "react";
import { axiosInstance } from "../services/apiConnector";
import { dashbordData } from "../services/apis";
import { FaBriefcase, FaBus } from "react-icons/fa";

const DashboardData = () => {
  const [employees, setEmployees] = useState([]);
  const [pendingOff, setPendingOff] = useState([]);
  const categoryCounts = {};

  employees.forEach((employee) => {
    const category = employee.category.designation;
    if (categoryCounts[category]) {
      categoryCounts[category]++;
    } else {
      categoryCounts[category] = 1;
    }
  });

  const categoryIcons = {
    CONTDUCTOR: <FaBriefcase />,
    DRIVER: <FaBus />,
  };

  const fetchEmployeeCount = async () => {
    const responce = await axiosInstance.get(
      dashbordData.COUNT_CATEGORY_WISE_EMPLOYEE
    );

    if (responce.data.success) {
      setEmployees(responce.data.employees);
    }
  };

  const fetchPendingOff = async () => {
    const responce = await axiosInstance.get(dashbordData.COUNT_PENDING_OFF);
    setPendingOff(responce.data.employeeOffs);
  };
  useEffect(() => {
    fetchEmployeeCount();
    fetchPendingOff();
  }, []);
  return (
    <div>
      {/* Grid for display employee count data */}
      <div className="bg-white py-8 px-4 m-4 rounded-xl">
      <h1 className="text-2xl mb-2 text-gray-900 font-semibold leading-10 w-full border-b-2 border-dashed">Employees</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4">
          {Object.keys(categoryCounts).length > 0 ? (
            Object.keys(categoryCounts).map((category, index) => (
              <div
                key={category}
                className={`${
                  index % 4 === 0
                    ? "bg-[#E91E63]"
                    : index % 4 === 1
                    ? "bg-[#00BCD4]"
                    : index % 4 === 2
                    ? "bg-[#8BC34A]"
                    : "bg-[#FF9800]"
                } flex items-center rounded-lg`}
              >
                <div
                  className={`${
                    index % 4 === 0
                      ? "bg-[#CD1A57]"
                      : index % 4 === 1
                      ? "bg-[#00A5BA]"
                      : index % 4 === 2
                      ? "bg-[#7AAB41]"
                      : "bg-[#E08600]"
                  } w-1/5 h-full flex items-center justify-center py-4 rounded-lg`}
                >
                  {categoryIcons[category]}{" "}
                </div>
                <div className="flex flex-col text-right w-4/5 rounded-lg pr-4 text-white font-semibold text-2xl py-2">
                  <div>{category}</div> <div>{categoryCounts[category]}</div>
                </div>
              </div>
            ))
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>

      {/* Grid for display employee Pending data */}
      <div className="bg-[white] py-8 px-4 m-4 rounded-xl">
      <h1 className="text-2xl mb-2 text-gray-900 font-semibold leading-10 w-full border-b-2 border-dashed">Employees Pending Off</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4 ">
        {Object.keys(pendingOff).length > 0 ? (
          Object.keys(pendingOff).map((category, index) => (
            <div
              key={category}
              className={`${
                index % 4 === 0
                  ? "bg-[#E91E63]"
                  : index % 4 === 1
                  ? "bg-[#00BCD4]"
                  : index % 4 === 2
                  ? "bg-[#8BC34A]"
                  : "bg-[#FF9800]"
              } flex items-center rounded-lg`}
            >
              <div
                className={`${
                  index % 4 === 0
                    ? "bg-[#CD1A57]"
                    : index % 4 === 1
                    ? "bg-[#00A5BA]"
                    : index % 4 === 2
                    ? "bg-[#7AAB41]"
                    : "bg-[#E08600]"
                } w-1/5 h-full flex items-center justify-center py-4 rounded-lg`}
              >
                {categoryIcons[category]}{" "}
              </div>
              <div className="flex flex-col text-right w-4/5 rounded-lg pr-4 text-white font-semibold text-2xl py-2">
                <div>{category}</div> <div>{pendingOff[category]}</div>
              </div>
            </div>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </div>
      </div>
    </div>
  );
};

export default DashboardData;
