// components/MarkAllAttendance.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { axiosInstance } from "../services/apiConnector";
import { attendanceApis, employeeApis } from "../services/apis";
import Sidebar from "../components/Sidebar";

const AddAttendence = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const fetchEmpployee = async () => {
    const data = await axiosInstance.get(employeeApis.GET_ALL_EMPLOYEE_APPI);
    setEmployees(data.data.data);
  };

  useEffect(() => {
    fetchEmpployee();
  }, []);

  const handleRadioChange = (employeeId, status) => {
    // Check if an entry for the employee exists in attendanceData
    const employeeIndex = attendanceData.findIndex(
      (data) => data.employeeId === employeeId
    );

    if (employeeIndex !== -1) {
      // If an entry exists, update its status
      const updatedData = [...attendanceData];
      updatedData[employeeIndex].status = status;
      setAttendanceData(updatedData);
    } else {
      // If no entry exists, create a new entry
      setAttendanceData([...attendanceData, { employeeId, status }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await axiosInstance.post(attendanceApis.ADDATTENDENCE_API, {
      date:selectedDate,
      attendanceData,
    });
    console.log({ date: selectedDate, attendanceData });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="container mx-auto mt-8 p-6 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">
          Mark Attendance for All Employees
        </h2>
        <h4></h4>
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
                    checked={attendanceData.some(
                      (data) =>
                        data.employeeId === employee._id &&
                        data.status === "present"
                    )}
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
                    checked={attendanceData.some(
                      (data) =>
                        data.employeeId === employee._id &&
                        data.status === "absent"
                    )}
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
                    checked={attendanceData.some(
                      (data) =>
                        data.employeeId === employee._id &&
                        data.status === "leave"
                    )}
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
      </div>
    </div>
  );
};

export default AddAttendence;
