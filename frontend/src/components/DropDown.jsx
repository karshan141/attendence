import React, { useState } from "react";

const DropDown = ({ designation, onSelect ,bgColor }) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const filteredItems = designation.filter((item) =>
    item.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleItemClick = (item) => {
    setSelectedItem(item.designation); // Set the selected item
    setSearchTerm(""); // Set the search term to the selected item
    setIsDropDownOpen(false);
    onSelect(item); // Notify the parent component about the selection
  };

  return (
    <div className="relative">
      <div onClick={() => setIsDropDownOpen(!isDropDownOpen)}>
        <input
          readOnly
          type="text"
          name="category"
          placeholder="CATEGORY"
          className={`${bgColor ? `bg-[${bgColor}]` : ""} border border-[#1171AD] h-[40px] rounded w-full p-4 `}
          value={selectedItem}
        />
      </div>
      {!isDropDownOpen ? (
        ""
      ) : (
        <div className="border absolute w-full bg-white rounded-b max-h-60 overflow-auto overflow-x-hidden">
          <div>
            <input
              type="text"
              name="category_search"
              className="border-2 border-black h-[30px] w-[100%]  p-4 my-1"
              value={searchTerm}
              autoFocus
              
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <ul className="flex flex-col  items-start gap-1">
              {filteredItems.map((item) => (
                <li key={item._id} onClick={() => handleItemClick(item)} 
                    className="hover:bg-[#5897FB] w-full text-start px-4 py-2"
                >
                  {item.designation}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDown;
