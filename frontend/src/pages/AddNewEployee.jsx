import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { axiosInstance } from "../services/apiConnector";
import { employeeApis, getAllCategory } from "../services/apis";
import toast from "react-hot-toast";

const AddNewEmployee = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    pfNumber: "",
    baseNumber: "",
    category: "", // Use a different name here
  });

  
  const [selectedCategory, setSelectedCategory] = useState("");

  const [designation, setDesignation] = useState([]);
  const fetchDesignation = async () => {
    const data = await axiosInstance.get(getAllCategory.GET_ALL_CATEGORY_API);
    setDesignation(data.data.data);
  };

  useEffect(() => {
    fetchDesignation();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setSelectedCategory(value);
    setFormData({
      ...formData,
      category: value, // Update the category in the form data
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await axiosInstance.post(
      employeeApis.ADDNEWEMPLOYEE_API,
      formData
    );
    const resData = result.data;

    if (resData.success) {
      toast.success(resData.message);
    } else {
      toast.error(resData.message);
    }
    window.location.href = "/viewemployee";
    
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="container bg-[#E6E6E6]">
        <div className="mt-12 bg-[#fff] m-4 py-6 px-12 rounded shadow">
          <form
            className="w-full flex flex-col gap-4 justify-start"
            onSubmit={handleSubmit}
          >
            <div className="flex gap-2">
              <div className="flex flex-col flex-1 gap-2">
                <label className="font-bold max-w-fit">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  name="firstName"
                  onChange={handleChange}
                  placeholder="Enter First Name"
                  className="border h-[40px] rounded w-full p-4"
                />
              </div>

              <div className="flex flex-col flex-1 gap-2">
                <label className="font-bold max-w-fit">Middle Name</label>
                <input
                  type="text"
                  value={formData.middleName}
                  name="middleName"
                  onChange={handleChange}
                  placeholder="Enter Middle Name"
                  className="border h-[40px] rounded w-full p-4"
                />
              </div>

              <div className="flex flex-col flex-1 gap-2">
                <label className="font-bold max-w-fit">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  name="lastName"
                  onChange={handleChange}
                  placeholder="Enter Last Name"
                  className="border h-[40px] rounded w-full p-4"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex flex-col flex-1 gap-2">
                <label className="font-bold max-w-fit">Pf Number</label>
                <input
                  type="text"
                  value={formData.pfNumber}
                  name="pfNumber"
                  onChange={handleChange}
                  placeholder="Enter PF Number"
                  className="border h-[40px] rounded w-full p-4"
                />
              </div>

              <div className="flex flex-col flex-1 gap-2">
                <label className="font-bold max-w-fit">Base Number</label>
                <input
                  type="text"
                  value={formData.baseNumber}
                  name="baseNumber"
                  onChange={handleChange}
                  placeholder="Enter Base Number"
                  className="border h-[40px] rounded w-full p-4"
                />
              </div>

              <div className="flex flex-col flex-1 gap-2">
                <label className="font-bold max-w-fit">Category</label>

                {designation.length > 0 ? (
                  <select
                    value={selectedCategory}
                    name="category"
                    onChange={handleCategoryChange}
                    className="border-2 border-black rounded h-[40px]"
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {designation.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.designation}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div></div>
                )}
              </div>
            </div>

            <button className="bg-[#815FC5] max-w-fit py-2 px-4 rounded text-white">
              Add Employee
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewEmployee;
