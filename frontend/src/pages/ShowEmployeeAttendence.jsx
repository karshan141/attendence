import React, { useState, useEffect } from "react";
import { axiosInstance } from "../services/apiConnector";
import { employeeApis, weeklyOffApis } from "../services/apis";
import toast from "react-hot-toast";
import axios from "axios";

const ShowEmployeeAttendence = () => {
  const [employeeId, setEmployeeId] = useState(""); // Selected employee ID

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [employees, setEmployees] = useState([]);

  const fetchEmpployee = async () => {
    const data = await axiosInstance.get(employeeApis.GET_ALL_EMPLOYEE_APPI);
    setEmployees(data.data.data);
  };

  useEffect(() => {
    fetchEmpployee();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/user/showEmployeeattendence?employeeId=${employeeId}&startDate=${startDate}&endDate=${endDate}`
      );
      setAttendanceData(response.data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchAttendanceData();
    }
  }, [startDate, endDate]);

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
            <div className="w-8/12 bg-white mt-4 m-auto p-4 rounded-t">Attendance Data For {attendanceData.length > 0 && attendanceData[0].firstName}</div>
      <div className="flex flex-wrap gap-4  p-4 w-8/12 m-auto bg-white rounded-b" >
        {attendanceData.length > 0 && attendanceData.map((empAtt) => (
          <div className={`flex flex-col min-w-[12%] ${empAtt.status !=='absent' ? 'bg-[#E3F2DB] border-green-900' : 'bg-[#FFE7E7] border-[#DFB2B5] text-[#DFB2B5]'}  p-4 gap-2 rounded-lg border-t-4  `}>
            <div className="text-left font-bold text-2xl">{empAtt.date.split("-")[0]}</div>
            <div className="border-l-2  border-green-800 pl-2 h-fit font-bold">
            {["Leave", "leave", "present", "absent"].includes(
                    empAtt.status
                  )
                    ? empAtt.status || " "
                    : (() => {
                        const value = empAtt.status;
                        if (value) {
                          const parts = value.split("-");
                          return (
                            
                              parts[0] + " " + parts[1]
                            
                          );
                        } else {
                          return null; // or return an empty string, depending on your preference
                        }
                      })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowEmployeeAttendence;
