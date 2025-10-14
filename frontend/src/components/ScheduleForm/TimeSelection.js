import React from "react";
import { FaClock } from "react-icons/fa"; // Import clock icon

const TimeSelection = ({ onChange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FaClock className="text-green-600 mr-2" /> Select Time
      </h3>

      <div className="relative">
        <FaClock className="absolute text-green-500 text-xl left-3 top-1/2 transform -translate-y-1/2" />
        
        <input
          type="time"
          className="w-full p-4 pl-12 border border-gray-300 rounded-lg shadow-md focus:ring-4 focus:ring-green-500 focus:border-green-500 transition-all ease-in-out duration-300"
          onChange={onChange}
        />
      </div>
      <div className="mt-4 mb-4">
        <hr/>
      </div>
    </div>
  );
};

export default TimeSelection;
