import React from "react";

const ShowEmployee = ({ employee, serialNumber, onDelete }) => {
  return (
    <div className="flex gap-10 bg-gray-100 p-4 rounded">
      <div className="w-16 text-center">{serialNumber + 1}</div>
      <div className="flex-1 w-44 text-left">{employee.firstName + " " +employee.middleName +" "+ employee.lastName}</div>
      <div className="flex-1 w-28 text-left">{employee.pfNumber}</div>
      <div className="flex-1 w-28 text-left">{employee.category.designation}</div>
    </div>
  );
};

export default ShowEmployee;
