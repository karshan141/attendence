import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";
import { axiosInstance } from "../services/apiConnector";
import { addNewCategory, getAllCategory } from "../services/apis";
import ShowCategory from "../components/ShowCategory";
import Navbar from "../components/Navbar";

const AddEmployeeCategory = () => {
  const [designation, setDesignation] = useState("");
  const [designation1, setDesignation1] = useState([]);

  const handelChange = (e) => {
    setDesignation(e.target.value.toUpperCase());
  };

  const handelAddCategory = async (e) => {
    e.preventDefault();

    const result = await axiosInstance.post(addNewCategory.ADDCATEGORY_API, {
      designation,
    });
    const resData = result.data;

    if (resData.success) {
      toast.success(resData.message);
    } else {
      toast(resData.message, {
        icon: "👏",
        style: {
          borderRadius: "10px",
          background: "#000",
          color: "#fff",
        },
      });
    }
    setDesignation("");
    fetchDesignation();
  };

  const fetchDesignation = async () => {
    const data = await axiosInstance.get(getAllCategory.GET_ALL_CATEGORY_API);    
    setDesignation1(data.data.data);
  };

  useEffect(() => {
    fetchDesignation();
  }, []);

  const handleDelete = async (id) => {
    
    console.log(`${addNewCategory.DELETECATEGORY_API}/${id}`);
    const response = await axiosInstance.delete(`${addNewCategory.DELETECATEGORY_API}/${id}`);
    console.log(response.data);

    if(response.data){
      toast.success(response.data.message);
    }
    fetchDesignation();
  };

  return (
    <div>
    <Navbar/>
    <div className="flex">
      <Sidebar />
      <div className="container bg-[#E6E6E6] pt-8">
        <div className="mt-12 bg-[#fff] m-4 py-6 px-12 rounded shadow">
          <form
            className="w-6/12 flex flex-col gap-4 justify-start"
            onSubmit={handelAddCategory}
          >
            <div className="flex flex-col gap-2 ">
              <label className="font-bold max-w-fit">Add New Designation</label>
              <input
                type="text"
                
                value={designation}
                name="designation"
                onChange={handelChange}
                placeholder="Enter Employe Designation"
                className="border h-[40px] rounded w-8/12 p-4"
              />
            </div>

            <button className="bg-[#815FC5] max-w-fit py-2 px-4 rounded  text-white">
              Add Designation
            </button>
          </form>
        </div>

        <div className="mt-12 bg-[#fff] m-4 py-6 px-12 rounded shadow flex flex-col  items-start">
          <div className="font-bold border-b-2 w-full text-left pb-2">
            Employe Designations
          </div>
          <div className="flex flex-col gap-4 items-start mt-8">
            {designation1.map((descs, index) => (
              <ShowCategory
                designation={descs}
                serialNumber={index}
                onDelete={() => handleDelete(descs._id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AddEmployeeCategory;
