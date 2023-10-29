import React, { useState, useEffect } from "react";
import { axiosInstance } from "../services/apiConnector";
import { attendanceApis, employeeApis, getAllCategory } from "../services/apis";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import DropDown from "../components/DropDown";
import { Paginasion } from "../components/Paginasion";

const AddAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [initialAttendanceData, setInitialAttendanceData] = useState({});
  const [markedAttendance, setMarkedAttendance] = useState([]);
  const [unmarkedAttendance, setUnmarkedAttendance] = useState([]);
  const [loader, setLoader] = useState(false);
  const [designation, setDesignation] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchDesignation = async () => {
    setLoader(true);
    const data = await axiosInstance.get(getAllCategory.GET_ALL_CATEGORY_API);
    setDesignation(data.data.data);
    setLoader(false);
  };

  const fetchEmployee = async () => {
    setLoader(true);
    console.log(selectedCategory);
    const data = await axiosInstance.get(
      `${employeeApis.GET_TYPE_WISE_EMPLOYEE_APPI}?selectedCategory=${selectedCategory}`
    );
    setEmployees(data.data.data);

    setLoader(false);
  };

  useEffect(() => {
    fetchDesignation();
  }, []);

  useEffect(() => {
    fetchEmployee();
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedDate && selectedCategory) {
      const fetchInitialAttendanceData = async () => {
        const result = await axiosInstance.get(
          attendanceApis.GET_ATTENDANCE_DATA_FOR_DATE_API,
          {
            params: { date: selectedDate, category: selectedCategory },
          }
        );
        if (result.data.success) {
          const initialData = {};
          result.data.data.forEach((item) => {
            if (["present", "absent"].includes(item.status)) {
              initialData[item.employeeId] = item.status;
            } else {
              initialData[item.employeeId] = "leave"; // Set to "leave" for other statuses
            }
          });
          setInitialAttendanceData(initialData);
        }
      };
      fetchInitialAttendanceData();
    }
  }, [selectedDate, selectedCategory]);

  useEffect(() => {
    // Calculate marked and unmarked attendance
    const marked = [];
    const unmarked = [];

    employees.forEach((employee) => {
      if (initialAttendanceData[employee._id]) {
        marked.push(employee);
      } else {
        unmarked.push(employee);
      }
    });

    setMarkedAttendance(marked);
    setUnmarkedAttendance(unmarked);
  }, [initialAttendanceData, employees]);

  const handleRadioChange = (employeeId, status) => {
    setInitialAttendanceData({
      ...initialAttendanceData,
      [employeeId]: status,
    });
  };

  // console.log(loader);
  const handleSubmit = async (e) => {
    setLoader(true);
    e.preventDefault();

    const attendanceData = Object.keys(initialAttendanceData).map(
      (employeeId) => ({
        employeeId,
        status: initialAttendanceData[employeeId],
      })
    );

    const result = await axiosInstance.post(attendanceApis.ADDATTENDENCE_API, {
      date: selectedDate,
      attendanceData,
    });

    if (result.data.success) {
      toast.success(result.data.message);
    } else {
      toast.error(result.data.message);
    }
    setLoader(false);
  };

  return (
    <div className="">
      <div>
      
        <Paginasion main="Attendence" sub="Add Attendence" />
      </div>
      {loader ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <div className="bg-white p-4 mt-4 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">
                Mark Attendance for Employees
              </h2>
              <div className="mb-4 flex gap-4">
                <div className="flex gap-2 items-center justify-center">
                  <label className="text-lg font-semibold">
                    Select Category:
                  </label>
                  <select
                    value={selectedCategory}
                    className="border border-blue-400 h-[40px] rounded"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Select an employee</option>
                    {designation.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.designation}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="">
                  <label className="text-lg font-semibold">Select Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border rounded p-2"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 mt-4 rounded-lg flex gap-4">
              <div className="flex-1">
                {employees.map((employee) => (
                  <div key={employee._id} className="mb-4 flex gap-20">
                    <label className="text-lg font-semibold">
                      {employee.baseNumber} :
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`attendance-${employee._id}`}
                          value="present"
                          onChange={() =>
                            handleRadioChange(employee._id, "present")
                          }
                          checked={
                            initialAttendanceData[employee._id] === "present"
                          }
                          className="mr-2"
                        />
                        <span className="text-green-500">Present</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`attendance-${employee._id}`}
                          value="absent"
                          onChange={() =>
                            handleRadioChange(employee._id, "absent")
                          }
                          checked={
                            initialAttendanceData[employee._id] === "absent"
                          }
                          className="mr-2"
                        />
                        <span className="text-red-500">Absent</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`attendance-${employee._id}`}
                          value="leave"
                          onChange={() =>
                            handleRadioChange(employee._id, "leave")
                          }
                          checked={
                            initialAttendanceData[employee._id] === "leave"
                          }
                          className="mr-2"
                        />
                        <span className="text-blue-500">Leave</span>
                      </label>
                    </div>
                  </div>
                ))}
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>

              <div className="flex-1">
                <div className="flex justify-evenly">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">
                      Marked Attendance:
                    </h3>
                    <ul>
                      {markedAttendance.map((employee) => (
                        <li key={employee._id}>{`${employee.baseNumber}`}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">
                      Unmarked Attendance:
                    </h3>
                    <ul>
                      {unmarkedAttendance.map((employee) => (
                        <li key={employee._id}>{`${employee.baseNumber}`}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddAttendance;
