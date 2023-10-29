import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../services/apiConnector";
import { addNewCategory, getAllCategory } from "../services/apis";
import Loader from "../components/Loader";
import { Paginasion } from "../components/Paginasion";

const AddEmployeeCategory = () => {
  const [designation, setDesignation] = useState("");
  const [designationList, setDesignationList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedDesignation, setEditedDesignation] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setDesignation(e.target.value.toUpperCase());
    setFieldError("");
  };

  // Handle adding a new category
  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!designation) {
      setFieldError("Designation is required.");
      return;
    }

    try {
      const result = await axiosInstance.post(addNewCategory.ADDCATEGORY_API, {
        designation,
      });
      const resData = result.data;

      if (resData.success) {
        toast.success(resData.message);
        setDesignation("");
        fetchDesignations();
      } else {
        toast.error(resData.message);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category. Please try again.");
    }
  };

  // Fetch designation data
  const fetchDesignations = async () => {
    setLoader(true);
    try {
      const data = await axiosInstance.get(getAllCategory.GET_ALL_CATEGORY_API);
      setDesignationList(data.data.data);
    } catch (error) {
      console.error("Error fetching designations:", error);
    }
    setLoader(false);
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  // Handle deleting a category
  const handleDelete = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!shouldDelete) {
      return; // Do nothing if the user cancels the delete action.
    }
    setLoader(true);
    try {
      const response = await axiosInstance.delete(
        `${addNewCategory.DELETECATEGORY_API}/${id}`
      );

      if (response.data) {
        toast.success(response.data.message);
        fetchDesignations();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category. Please try again.");
    }
    setLoader(false);
  };

  // Handle editing a category
  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedDesignation(designationList[index].designation);
  };

  // Handle saving the edited category
  const handleSaveEdit = async (id) => {
    try {
      const editedValue = editedDesignation;
      const response = await axiosInstance.put(
        addNewCategory.EDITCATEGORY_API,
        {
          designation: editedValue,
          id: id,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEditingIndex(-1);
        fetchDesignations();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error saving edit:", error);
      toast.error("Failed to save edit. Please try again.");
    }
  };

  // Handle canceling the edit mode
  const handleCancelEdit = () => {
    setEditingIndex(-1);
  };

  return (
    <div>
      {loader ? (
        <Loader />
      ) : (
        <div>
          <div>
            <Paginasion main="Employee" sub="AddDesignation" />
          </div>
          <div className="mt-8 bg-[#fff]  py-6 px-12 rounded shadow">
            <form
              className="w-full sm:w-6/12 flex flex-col gap-4  justify-start"
              onSubmit={handleAddCategory}
            >
              <div className="flex flex-col gap-4 ">
                <label className="font-bold max-w-fit">
                  Add New Designation
                </label>
                <input
                  type="text"
                  value={designation}
                  name="designation"
                  onChange={handleChange}
                  placeholder="Enter Employee Designation"
                  className="border h-[40px] rounded w-full sm:w-8/12 p-4 border-gray-400"
                />
                {fieldError && <div className="text-red-500">{fieldError}</div>}
              </div>

              <button className="bg-[#815FC5] max-w-fit py-2 px-4 rounded  text-white">
                Add Designation
              </button>
            </form>
          </div>

          <div className="mt-12 bg-[#fff]   py-6  rounded shadow overflow-x-auto">
            {designationList.length > 0 ? (
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
                  {designationList.map((desc, index) => (
                    <tr key={desc._id}>
                      <td className="py-2">{index + 1}</td>
                      <td className="py-2">
                        {editingIndex === index ? (
                          <input
                            type="text"
                            value={editedDesignation}
                            onChange={(e) =>
                              setEditedDesignation(e.target.value.toUpperCase())
                            }
                            className="border border-gray-400 rounded h-8 p-4"
                          />
                        ) : (
                          <span>{desc.designation}</span>
                        )}
                      </td>
                      <td className="py-2">
                        {editingIndex === index ? (
                          <div>
                            <button
                              className="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                              onClick={() => handleSaveEdit(desc._id)}
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
                          onClick={() => handleDelete(desc._id)}
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
