import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { axiosInstance } from "../services/apiConnector";
import { employeeApis } from "../services/apis";
import ShowEmployee from "../components/ShowEmployee";

const ViewAllEmployee = () => {
  const [employee, setEmployee] = useState([]);

  const fetchEmpployee = async () => {
    const data = await axiosInstance.get(employeeApis.GET_ALL_EMPLOYEE_APPI);
    setEmployee(data.data.data);
  };

  useEffect(() => {
    fetchEmpployee();
  }, []);

  // const handleDelete = async (id) => {

  //   console.log(`${addNewCategory.DELETECATEGORY_API}/${id}`);
  //   const response = await axiosInstance.delete(`${addNewCategory.DELETECATEGORY_API}/${id}`);
  //   console.log(response.data);

  //   if(response.data){
  //     toast.success(response.data.message);
  //   }
  //   fetchDesignation();
  // };

  return (
    <div>
      <div className="mt-12 bg-[#fff] m-4 py-6 px-12 rounded shadow flex flex-col  items-start">
        <div className="font-bold border-b-2 w-full text-left pb-2">
          Employe Designations
        </div>
        <div className="flex flex-col gap-4 items-start mt-8">
          {employee.map((descs, index) => (
            <ShowEmployee
              key={descs._id}
              employee={descs}
              serialNumber={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewAllEmployee;
