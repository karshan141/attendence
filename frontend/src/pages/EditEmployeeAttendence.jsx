import React, { useState, useEffect } from "react";
import { axiosInstance } from "../services/apiConnector";
import { attendanceApis, employeeApis } from "../services/apis";
import toast from "react-hot-toast";
import axios from "axios";



const EditEmployeeAttendence = () => {
  const [employeeId, setEmployeeId] = useState(""); // Selected employee ID
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Define a state for selected statuses for each attendance record
  const [selectedStatuses, setSelectedStatuses] = useState({});

  const fetchEmployee = async () => {
    const data = await axiosInstance.get(employeeApis.GET_ALL_EMPLOYEE_APPI);
    setEmployees(data.data.data);
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/user/showEmployeeattendence?employeeId=${employeeId}&startDate=${startDate}&endDate=${endDate}`
      );
      setAttendanceData(response.data);

      // Initialize selected statuses for each attendance record
      const initialSelectedStatuses = {};
      response.data.forEach((empAtt) => {
        initialSelectedStatuses[empAtt._id] = empAtt.status || ""; // Default value is an empty string
      });
      setSelectedStatuses(initialSelectedStatuses);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchAttendanceData();
    }
  }, [startDate, endDate]);

  // Handle radio button changes for each attendance record
  const handleRadioChange = (attendanceId, status) => {
    setSelectedStatuses({
      ...selectedStatuses,
      [attendanceId]: status,
    });
  };

  const handleEditButtonClick = async (attendanceId, date) => {
    try {
      const newStatus = selectedStatuses[attendanceId];
      // Make a PUT request to update the attendance status
      const response = await axiosInstance.put(
        attendanceApis.UPDATE_EMPLOYEE_ATTENDENCE_API,
        {
          attendanceId,
          status: newStatus, // Use the selected status
          employeeId,
          date,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchAttendanceData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating attendance record:", error);
      toast.error("An error occurred while updating attendance record");
    }
  };

  return (
    <div>
      <h2>Set Employee Schedule</h2>
      <div>
        <label>Select Employee:</label>
        <select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        >
          <option value="">Select an employee</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.firstName} {employee.lastName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={fetchAttendanceData}>Generate Report</button>
      </div>
      <div className="w-8/12 bg-white mt-4 m-auto p-4 rounded-t">
        Attendance Data For{" "}
        {attendanceData.length > 0 && attendanceData[0].firstName}
      </div>
      <div className="flex flex-wrap gap-4 p-4 w-8/12 m-auto bg-white rounded-b">
        {attendanceData.length > 0 &&
          attendanceData.map((empAtt) => (
            <div
              className={`flex flex-col min-w-[12%] ${
                empAtt.status !== "absent"
                  ? "bg-[#E3F2DB] border-green-900"
                  : "bg-[#FFE7E7] border-[#DFB2B5] text-[#DFB2B5]"
              } p-4 gap-2 rounded-lg border-t-4`}
              key={empAtt._id}
            >
              <div className="text-left font-bold text-2xl">
                {empAtt.date}
              </div>
              <div className="border-l-2  border-green-800 pl-2 h-fit font-bold">
                {["Leave", "leave", "present", "absent"].includes(
                  empAtt.status
                )
                  ? empAtt.status || " "
                  : (() => {
                      const value = empAtt.status;
                      if (value) {
                        const parts = value.split("-");
                        return parts[0] + " " + parts[1];
                      } else {
                        return null;
                      }
                    })()}
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    value="present"
                    checked={selectedStatuses[empAtt._id] === "present"}
                    onChange={() => handleRadioChange(empAtt._id, "present")}
                  />
                  Present
                </label>
                <label>
                  <input
                    type="radio"
                    value="leave"
                    checked={selectedStatuses[empAtt._id] === "leave"}
                    onChange={() => handleRadioChange(empAtt._id, "leave")}
                  />
                  Leave
                </label>
                <label>
                  <input
                    type="radio"
                    value="absent"
                    checked={selectedStatuses[empAtt._id] === "absent"}
                    onChange={() => handleRadioChange(empAtt._id, "absent")}
                  />
                  Absent
                </label>
              </div>
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
                onClick={() => handleEditButtonClick(empAtt._id, empAtt.date)}
              >
                Edit
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default EditEmployeeAttendence;

