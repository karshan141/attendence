import React, { useState, useEffect } from "react";
import { axiosInstance } from "../services/apiConnector";
import { employeeApis, weeklyOffApis } from "../services/apis";
import toast from "react-hot-toast";

const AddOffDay = () => {
  const [employeeId, setEmployeeId] = useState(""); // Selected employee ID
  const [weeklyOffDay, setWeeklyOffDay] = useState("");
  const [pendingOffs, setPendingOffs] = useState([]);
  const [lastOffDate, setLastOffDate] = useState(""); // Date format: "YYYY-MM-DD"
  const [employees, setEmployees] = useState([]);

  const fetchEmpployee = async () => {
    const data = await axiosInstance.get(employeeApis.GET_ALL_EMPLOYEE_APPI);    
    setEmployees(data.data.data);
    console.log(data.data.data);
  };


  useEffect(() => {
    fetchEmpployee();
  }, []);

  useEffect(() => {
    // Function to generate pending off dates based on the weekly off day
    const generatePendingOffs = () => {
      if (weeklyOffDay && lastOffDate) {
        const currentDate = new Date();
        const lastOffDateObj = new Date(lastOffDate);
        const pendingOffDates = [];

        // If the last off date is today or in the future, don't include it
        if (lastOffDateObj <= currentDate) {
          lastOffDateObj.setDate(lastOffDateObj.getDate() + 1); // Move to the next day
        }

        while (lastOffDateObj <= currentDate) {
          if (lastOffDateObj.getDay() === getDayNumber(weeklyOffDay)) {
            // If the day matches the weekly off day, add it to pending offs
            const year = lastOffDateObj.getFullYear();
            const month = String(lastOffDateObj.getMonth() + 1).padStart(
              2,
              "0"
            );
            const day = String(lastOffDateObj.getDate()).padStart(2, "0");
            pendingOffDates.push(`${year}-${month}-${day}`);
          }
          // Move to the next day
          lastOffDateObj.setDate(lastOffDateObj.getDate() + 1);
        }

        setPendingOffs(pendingOffDates);
      }
    };

    // Helper function to get the day number (0 for Sunday, 1 for Monday, etc.)
    const getDayNumber = (day) => {
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return daysOfWeek.indexOf(day);
    };

    generatePendingOffs();
  }, [weeklyOffDay, lastOffDate]);

  // Handle saving the schedule (you'll need to implement this)
  const saveSchedule = async() => {
    // Send a POST request to your backend API to save the schedule
    const scheduleData = {
      employeeId,
      weeklyOffDay,
      pendingOffs,
      lastOffDate,
      // Add other data such as employee ID, if needed
    };

    const result = await axiosInstance.post(
      weeklyOffApis.SETWEEKLYOFF_API,
      scheduleData,
    );
    
    const resData = result.data;
    

    if (resData.success) {
      toast.success(resData.message);
    } else {
      toast.error(resData.message);
    }

    console.log(scheduleData);

    // Implement the logic to send this data to your backend
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
        <label>Weekly Off Day:</label>
        <select
          value={weeklyOffDay}
          onChange={(e) => setWeeklyOffDay(e.target.value)}
        >
          <option value="">Select a day</option>
          {[
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ].map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Last Off Date:</label>
        <input
          type="date"
          value={lastOffDate}
          onChange={(e) => setLastOffDate(e.target.value)}
        />
      </div>
      <div>
        <label>Pending Off Dates:</label>
        <ul>
          {pendingOffs.map((date) => (
            <li key={date}>{date}</li>
          ))}
        </ul>
      </div>
      <button onClick={saveSchedule}>Save Schedule</button>
    </div>
  );
};

export default AddOffDay;
