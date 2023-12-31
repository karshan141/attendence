import React, { useState,useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { axiosInstance } from "../services/apiConnector";
import { attendanceApis, getAllCategory } from "../services/apis";
import Loader from "../components/Loader";
import { Paginasion } from "../components/Paginasion";
import DropDown from "../components/DropDown";

const ShowAttendance = () => {
  //Print Functinality
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  //Fetch Designations
  
  const [designation, setDesignation] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const fetchDesignation = async () => {
    setLoader(true);
    const data = await axiosInstance.get(getAllCategory.GET_ALL_CATEGORY_API);
    setDesignation(data.data.data);
    setLoader(false);    
  };

  useEffect(() => {
    fetchDesignation();
  }, []);

  //Category Change event handler
  const handleCategoryChange = (selectedItem) => {
    setSelectedCategory({
      _id: selectedItem._id,
      name: selectedItem.designation // Adjust the property accordingly based on your data structure
    });
  };


  const [loader, setLoader] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  // Fetch attendance data based on selected date range
  const fetchAttendanceData = async () => {
    setLoader(true);
    try {
      const response = await axiosInstance.get(
        attendanceApis.ATTENDANCE_MUSTER_API,
        {
          params: { startDate: startDate, endDate: endDate, category : selectedCategory },
        }
      );

      setAttendanceData(response.data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
    setLoader(false);
  };

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

  const countData = {};

  // Iterate through the data
  Object.keys(formattedData).forEach((employee) => {
    const dates = Object.values(formattedData[employee]);

    // Count occurrences of "present," "absent," and "leave"
    const countPresent = dates.filter((date) => date === "present").length;
    const countAbsent = dates.filter((date) => date.includes("absent")).length;
    const countLeave = dates.filter((date) => date.includes("leave")).length;
    const countPh = dates.filter((date) => date.includes("ph")).length;
    const countOff = dates.filter((date) => date.includes("off")).length;

    // Store the counts in an object
    countData[employee] = {
      present: countPresent,
      absent: countAbsent,
      leave: countLeave,
      ph: countPh,
      off: countOff,
    };
  });
  return (
    <div>
      <div>
        <Paginasion main="Attendence" sub="Show Attendence" />
      </div>
      {loader ? (
        <Loader />
      ) : (
        <div>
          <div className="bg-[#fff] mt-8 py-6 px-12 rounded shadow flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Attendance Report</h2>
            <div className="flex items-end gap-8">
              <div className="flex flex-col gap-2 font-semibold text-xl">
                <label className="">Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border-2 rounded p-1 bg-[#EAECF4]"
                />
              </div>
              <div className="flex flex-col gap-2 font-semibold text-xl">
                <label>End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border-2 rounded p-1 bg-[#EAECF4]"
                />
              </div>

              <div className="flex flex-col gap-2 font-semibold text-xl">
                  <label>Category</label>     
                  <div className="bg-[#EAECF4]">
                  <DropDown
                  bgColor={"#EAECF4"}
                    designation={designation}
                    onSelect={handleCategoryChange}
                  />
                  </div>             
                </div>


              <button
                className="bg-[#5C6ED8] py-2 px-4 rounded text-white hover:bg-[#ca8d5b]"
                onClick={fetchAttendanceData}
              >
                Generate Report
              </button>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className=" p-2 bg-blue-500 text-white hover:bg-red-400 m-4 rounded flex"
          >
            Print this out!
          </button>

          <style type="text/css" media="print">
            {`@page { margin: 20px !important; } { size: portrait; }`}
          </style>
          <div className="overflow-x-auto">
            <div ref={componentRef}>
            <div className="text-yellow-700 font-bold text-2xl my-2">Show Attendance For {selectedCategory.name} From {startDate} To {endDate} </div>
              <table className="border-collapse w-full text-center">
                <thead>
                  <tr>
                    <th className="border border-gray-600 p-2">Name</th>
                    {uniqueDates.map((date) => (
                      <th key={date} className="border border-gray-600 p-2">
                        {date.split("-")[0]}
                      </th>
                    ))}
                    <th className="border border-gray-600 p-2">P</th>
                    <th className="border border-gray-600 p-2">L</th>
                    <th className="border border-gray-600 p-2">A</th>
                    <th className="border border-gray-600 p-2">OFF</th>
                    <th className="border border-gray-600 p-2">PH</th>
                  </tr>
                </thead>

                <tbody>
                  {Object.keys(formattedData).map((name) => (
                    <tr key={name} className="border border-gray-600">
                      <td className="border border-gray-600 p-2">{name}</td>
                      {uniqueDates.map((date) => {
                        const cellValue = formattedData[name][date];
                        return (
                          <td key={date} className="border border-gray-600 p-2">
                            {["Leave", "leave", "present", "absent"].includes(
                              cellValue
                            )
                              ? cellValue.charAt(0).toUpperCase()
                              : (() => {
                                  const value = cellValue;
                                  if (value) {
                                    const parts = value.split(" ");
                                    return (
                                      <>
                                        <div>{parts[0]}</div>
                                        <div>
                                          {parts[1].split("-")[0] +
                                            "-" +
                                            parts[1].split("-")[1]}
                                        </div>
                                      </>
                                    );
                                  } else {
                                    return null;
                                  }
                                })()}
                          </td>
                        );
                      })}
                      <td className="border border-gray-600 p-2">
                        {<div> {countData[name].present}</div>}
                      </td>
                      <td className="border border-gray-600 p-2">
                        {<div> {countData[name].leave}</div>}
                      </td>
                      <td className="border border-gray-600 p-2">
                        {<div> {countData[name].absent}</div>}
                      </td>
                      <td className="border border-gray-600 p-2">
                        {<div> {countData[name].off}</div>}
                      </td>
                      <td className="border border-gray-600 p-2">
                        {<div> {countData[name].ph}</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowAttendance;
