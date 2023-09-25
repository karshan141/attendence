import React, { useState } from "react";
import { axiosInstance } from "../services/apiConnector";
import { paidHolidayApis } from "../services/apis";
import toast from "react-hot-toast";

function PaidHoliday() {
  const [phList, setPhList] = useState([]); // To store the list of PH days
  const [date, setDate] = useState(""); // To store the date input
  const [name, setName] = useState(""); // To store the description input
  const [error, setError] = useState(""); // To handle validation error

  // Function to handle adding a PH day to the list
  const handleAddPh = () => {
    if (date && name) {
      // Check if the date already exists in the list
      const isDuplicateDate = phList.some((ph) => ph.date === date);

      if (!isDuplicateDate) {
        if (phList.length < 9) {
          // Create a new PH day object
          const newPhDay = {
            name,
            date,
          };

          // Add the new PH day to the list
          setPhList([...phList, newPhDay]);

          // Sort the list by date in ascending order
          const sortedPhList = [...phList, newPhDay].sort((a, b) =>
            a.date.localeCompare(b.date)
          );

          // Update the state with the sorted list
          setPhList(sortedPhList);

          // Clear the input fields and error
          setDate("");
          setName("");
          setError("");
        } else {
          setError("Maximum of nine entries allowed.");
        }
      } else {
        setError("Date already exists in the list.");
      }
    } else {
      setError("Both date and description are required.");
    }
  };

  // Function to handle submitting the PH list to the server
  const handleSubmit = async () => {
    if (phList.length > 0) {
      const response = await axiosInstance.post(
        paidHolidayApis.ADD_PAIHOLIDAY_API,
        phList
      );

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      setPhList([]);
    }
    else{
      toast.error("Please enter name and date to add Paid Holiday")
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-semibold mb-4">
          Add Paid Holidays for the Year
        </h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <div className="flex space-x-4 mb-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 border rounded-lg flex-grow"
            placeholder="Date"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 border rounded-lg flex-grow"
            placeholder="Description"
          />
          <button
            onClick={handleAddPh}
            disabled={phList.length >= 9}
            className={`px-4 py-2 rounded-lg ${
              phList.length >= 9
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Add PH
          </button>
        </div>
        <ul className="list-disc pl-4">
          {phList.map((ph, index) => (
            <li key={index} className="mb-2">
              {ph.date} - {ph.name}
            </li>
          ))}
        </ul>
        <button
          onClick={handleSubmit}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mt-4"
        >
          Submit to Server
        </button>
      </div>
    </div>
  );
}

export default PaidHoliday;
