import React, { useState, useEffect } from "react";
import { axiosInstance } from "../services/apiConnector";
import { attendanceApis, employeeApis } from "../services/apis";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const EditEmployeeAttendence = () => {
  const [employeeId, setEmployeeId] = useState(""); // Selected employee ID
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loader, setLoader] = useState(false);

  // Define a state for selected statuses for each attendance record
  const [selectedStatuses, setSelectedStatuses] = useState({});

  const fetchEmployee = async () => {
    setLoader(true);
    const data = await axiosInstance.get(employeeApis.GET_ALL_EMPLOYEE_APPI);
    setEmployees(data.data.data);
    setLoader(false);
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchAttendanceData = async () => {
    setLoader(true);
    try {
      const response = await axiosInstance.get(
        attendanceApis.GET_EMPLOYEE_WISE_ATTENDENCE_APPI,
        {
          params: {
            employeeId: employeeId,
            startDate: startDate,
            endDate: endDate,
          },
        }
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
    setLoader(false);
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
    setLoader(true);
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
    setLoader(false);
  };

  return (
    <div>
      {loader ? (
        <Loader />
      ) : (
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
          <div className="w-11/12 bg-white mt-4 m-auto p-4 rounded-t">
            Attendance Data For{" "}
            {attendanceData.length > 0 && attendanceData[0].firstName}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 w-11/12 m-auto bg-white rounded-b">
            {attendanceData.length > 0 &&
              attendanceData.map((empAtt) => (
                <div
                  className={`bg-[#E3F2DB] border-green-900 p-4 rounded-lg border-t-4`}
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
                  <div className="flex justify-between mt-2">
                    <label className="flex items-center space-x-1">
                      <input
                        type="radio"
                        value="present"
                        checked={selectedStatuses[empAtt._id] === "present"}
                        onChange={() =>
                          handleRadioChange(empAtt._id, "present")
                        }
                      />
                      Present
                    </label>
                    <label className="flex items-center space-x-1">
                      <input
                        type="radio"
                        value="leave"
                        checked={selectedStatuses[empAtt._id] === "leave"}
                        onChange={() => handleRadioChange(empAtt._id, "leave")}
                      />
                      Leave
                    </label>
                    <label className="flex items-center space-x-1">
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
                    onClick={() =>
                      handleEditButtonClick(empAtt._id, empAtt.date)
                    }
                  >
                    Edit
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditEmployeeAttendence;
