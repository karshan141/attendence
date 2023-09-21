import React, { useState } from "react";

const ShowCategory = ({ designation, serialNumber, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDesignation, setEditedDesignation] = useState(
    designation.designation
  );

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // Save the edited designation and exit edit mode
    setIsEditing(false);

    // You can now send the edited designation to your backend or update it as needed
    // For example, you can make an API call to save the changes
    // Assuming you have a function `saveEditedDesignation` that handles this
    // saveEditedDesignation(designation._id, editedDesignation);
  };

  const handleInputChange = (e) => {
    setEditedDesignation(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveClick();
    }
  };

  return (
    <div className="flex gap-10 bg-gray-100 p-4 rounded">
      <div className="w-16 text-center">{serialNumber + 1}</div>
      {isEditing ? (
        <input
          type="text"
          value={editedDesignation}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 w-28 text-center border border-gray-300 rounded px-2 py-1"
        />
      ) : (
        <div className="flex-1 w-28 text-center" onClick={handleEditClick}>
          {designation.designation}
        </div>
      )}
      <button
        onClick={isEditing ? handleSaveClick : onDelete}
        className={`${
          isEditing
            ? "bg-green-500 hover:bg-green-600"
            : "bg-red-500 hover:bg-red-600"
        } text-white px-2 py-1 rounded`}
      >
        {isEditing ? "Save" : "Delete"}
      </button>
    </div>
  );
};

export default ShowCategory;
