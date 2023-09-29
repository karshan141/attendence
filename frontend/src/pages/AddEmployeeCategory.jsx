import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../services/apiConnector";
import { addNewCategory, getAllCategory } from "../services/apis";
import ShowCategory from "../components/ShowCategory";
import { CSVLink, CSVDownload } from "react-csv";

const AddEmployeeCategory = () => {
  const [designation, setDesignation] = useState("");
  const [designation1, setDesignation1] = useState([]);
  const [exportData , setExportData] = useState([]);

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

    const storedTableData = designation1.map((data, index) => ({
      "Sr. No.": index + 1,
      POST: data.designation,
    }));

    setExportData(storedTableData);
  };

  useEffect(() => {
    fetchDesignation();
  }, []);

  const handleDelete = async (id) => {
    console.log(`${addNewCategory.DELETECATEGORY_API}/${id}`);
    const response = await axiosInstance.delete(
      `${addNewCategory.DELETECATEGORY_API}/${id}`
    );
    console.log(response.data);

    if (response.data) {
      toast.success(response.data.message);
    }
    fetchDesignation();
  };

  return (
    <div>
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

      <div className="mt-12 bg-[#fff] max-w-lg m-4 py-6 px-12 rounded shadow overflow-x-auto">
        <CSVLink data={exportData}>Download me</CSVLink>

        <table className="w-full whitespace-nowrap">
          <thead>
            <tr>
              <th className="font-bold ">Sr. No.</th>
              <th className="font-bold ">Designation</th>
              <th className="font-bold ">Delete</th>
            </tr>
          </thead>
          <tbody>
            {designation1.map((descs, index) => (
              <tr key={descs._id}>
                <td className="py-2">{index + 1}</td>
                <td className="py-2">{descs.designation}</td>
                <td className="py-2">
                  <button
                    className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    onClick={() => handleDelete(descs._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddEmployeeCategory;
