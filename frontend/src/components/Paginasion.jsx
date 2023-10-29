import React from "react";

export const Paginasion = ({main, sub}) => {
  return (
    <div className="my-4 bg-[#EAECF4] px-4 py-2 rounded text-[1.2rem]">
      {main} / <span className="text-[#4E73DF]"> {sub}</span>
    </div>
  );
};
