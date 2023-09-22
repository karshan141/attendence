import React, { useState, useEffect } from "react";
import axios from "axios";

const ShowAttendance = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);

  // Fetch attendance data based on selected date range
  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/user/showattendence?startDate=${startDate}&endDate=${endDate}`
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

  // Extract unique dates
  const uniqueDates = [...new Set(attendanceData.map((entry) => entry.date))];

  // Create a data structure to store the attendance in the desired format
  const formattedData = {};

  // Fill the formattedData with attendance information
  attendanceData.forEach((entry) => {
    const { firstName, date, status } = entry;
    if (!formattedData[firstName]) {
      formattedData[firstName] = {};
    }
    formattedData[firstName][date] = status;
  });

  console.log(formattedData);
  return (
    <div>
      <h2>Attendance Report</h2>
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
      <table>
        <thead>
          <tr>
            <th>Name</th>
            {uniqueDates.map((date) => (
              <th key={date}>{date}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(formattedData).map((name) => (
            <tr key={name}>
              <td>{name}</td>
              {/* {uniqueDates.map((date) => (                
                <td key={date}>{formattedData[name][date] || ""}</td>
                
              ))} */}
              {uniqueDates.map((date) => (
                <td key={date}>
                  {["Leave", "leave", "present", "absent"].includes(
                    formattedData[name][date]
                  )
                    ? formattedData[name][date]
                    : (() => {
                        const parts = formattedData[name][date].split(" ");
                        
                        return (
                          <>
                            <div>{parts[0]}</div>
                            <div>{parts[1]}</div>
                          </>
                        );
                      })()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowAttendance;
