import React, { useState, useEffect } from "react";
import { axiosInstance } from "../services/apiConnector";
import { attendanceApis, employeeApis } from "../services/apis";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";

const AddAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [initialAttendanceData, setInitialAttendanceData] = useState({});
  const [markedAttendance, setMarkedAttendance] = useState([]);
  const [unmarkedAttendance, setUnmarkedAttendance] = useState([]);

  useEffect(() => {
    const fetchEmployee = async () => {
      const data = await axiosInstance.get(employeeApis.GET_ALL_EMPLOYEE_APPI);
      setEmployees(data.data.data);
    };
    fetchEmployee();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const fetchInitialAttendanceData = async () => {
        const result = await axiosInstance.get(
          attendanceApis.GET_ATTENDANCE_DATA_FOR_DATE_API,
          {
            params: { date: selectedDate },
          }
        );
        console.log(result.data.data);
        if (result.data.success) {
          const initialData = {};
          result.data.data.forEach((item) => {
            initialData[item.employeeId] = item.status;
          });
          setInitialAttendanceData(initialData);
        }
      };
      fetchInitialAttendanceData();
    }
  }, [selectedDate]);

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

  const handleSubmit = async (e) => {
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
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="container mx-auto mt-8 p-6 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">
          Mark Attendance for All Employees
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-lg font-semibold">Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded p-2"
              required
            />
          </div>

          {employees.map((employee) => (
            <div key={employee._id} className="mb-4">
              <label className="text-lg font-semibold">
                {employee.firstName} {employee.lastName}:
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`attendance-${employee._id}`}
                    value="present"
                    onChange={() => handleRadioChange(employee._id, "present")}
                    checked={initialAttendanceData[employee._id] === "present"}
                    className="mr-2"
                  />
                  <span className="text-green-500">Present</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`attendance-${employee._id}`}
                    value="absent"
                    onChange={() => handleRadioChange(employee._id, "absent")}
                    checked={initialAttendanceData[employee._id] === "absent"}
                    className="mr-2"
                  />
                  <span className="text-red-500">Absent</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`attendance-${employee._id}`}
                    value="leave"
                    onChange={() => handleRadioChange(employee._id, "leave")}
                    checked={initialAttendanceData[employee._id] === "leave"}
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
        </form>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Marked Attendance:</h3>
          <ul>
            {markedAttendance.map((employee) => (
              <li key={employee._id}>
                {`${employee.firstName} ${employee.lastName}`}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Unmarked Attendance:</h3>
          <ul>
            {unmarkedAttendance.map((employee) => (
              <li key={employee._id}>
                {`${employee.firstName} ${employee.lastName}`}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddAttendance;
