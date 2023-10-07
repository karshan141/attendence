import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../services/apiConnector";
import { addNewCategory, getAllCategory } from "../services/apis";
import Loader from "../components/Loader";

const AddEmployeeCategory = () => {
  const [designation, setDesignation] = useState("");
  const [designation1, setDesignation1] = useState([]);
  const [loader, setLoader] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedDesignations, setEditedDesignations] = useState("");

  const handelChange = (e) => {
    setDesignation(e.target.value.toUpperCase());
    setFieldError("");
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
      toast.error(resData.message);
    }
    setDesignation("");
    fetchDesignation();
  };

  const fetchDesignation = async () => {
    setLoader(true);
    const data = await axiosInstance.get(getAllCategory.GET_ALL_CATEGORY_API);
    setDesignation1(data.data.data);
    setLoader(false);
  };

  useEffect(() => {
    fetchDesignation();
  }, []);

  const handleDelete = async (id) => {
    setLoader(true);
    const response = await axiosInstance.delete(
      `${addNewCategory.DELETECATEGORY_API}/${id}`
    );

    if (response.data) {
      toast.success(response.data.message);
    }
    fetchDesignation();
    setLoader(false);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedDesignations(designation1[index].designation);
  };

  const handleSaveEdit = async (id) => {
    const editedValue = editedDesignations;
    const response = await axiosInstance.put(addNewCategory.EDITCATEGORY_API, {
      designation: editedValue,
      id: id,
    });

    if (response.data.success) {
      toast.success(response.data.message);
      setEditingIndex(-1);
      fetchDesignation();
    } else {
      toast.error(response.data.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(-1);
  };

  return (
    <div>
      {loader ? (
        <Loader />
      ) : (
        <div>
          <div className="mt-12 bg-[#fff] m-4 py-6 px-12 rounded shadow">
            <form
              className="w-6/12 flex flex-col gap-4 justify-start"
              onSubmit={handelAddCategory}
            >
              <div className="flex flex-col gap-2 ">
                <label className="font-bold max-w-fit">
                  Add New Designation
                </label>
                <input
                  type="text"
                  value={designation}
                  name="designation"
                  onChange={handelChange}
                  placeholder="Enter Employee Designation"
                  className="border h-[40px] rounded w-8/12 p-4 border-gray-400"
                />
                {fieldError && <div className="text-red-500">{fieldError}</div>}
              </div>

              <button className="bg-[#815FC5] max-w-fit py-2 px-4 rounded  text-white">
                Add Designation
              </button>
            </form>
          </div>

          <div className="mt-12 bg-[#fff]  m-4 py-6 px-12 rounded shadow overflow-x-auto">
            {designation1.length > 0 ? (
              <table className="w-full whitespace-nowrap  text-center">
                <thead>
                  <tr>
                    <th className="font-bold ">Sr. No.</th>
                    <th className="font-bold ">Designation</th>
                    <th className="font-bold ">Edit</th>
                    <th className="font-bold ">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {designation1.map((descs, index) => (
                    <tr key={descs._id}>
                      <td className="py-2">{index + 1}</td>
                      <td className="py-2">
                        {editingIndex === index ? (
                          <input
                            type="text"
                            value={editedDesignations}
                            onChange={(e) =>
                              setEditedDesignations(
                                e.target.value.toUpperCase()
                              )
                            }
                            className="border border-gray-400 rounded h-8 p-4"
                          />
                        ) : (
                          <span>{descs.designation}</span>
                        )}
                      </td>
                      <td className="py-2">
                        {editingIndex === index ? (
                          <div>
                            <button
                              className="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                              onClick={() => handleSaveEdit(descs._id)}
                            >
                              Save
                            </button>
                            <button
                              className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600 ml-2"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="px-6 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                            onClick={() => handleEdit(index)}
                          >
                            Edit
                          </button>
                        )}
                      </td>
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
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEmployeeCategory;
