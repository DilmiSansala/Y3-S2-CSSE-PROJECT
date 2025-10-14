import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa"; // Icon for location
import centerImage from "../assets/center.jpg"; // Example image for the center

const CenterSelection = ({ centers, selectedCenter, setSelectedCenter }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Select Collection Center:
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {centers.map((center) => (
          <div
            key={center._id}
            onClick={() => setSelectedCenter(center._id)} // Set the selected center on click
            className={`relative cursor-pointer p-2 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 border-2 ${
              selectedCenter === center._id
                ? "border-green-500 ring-2 ring-green-300"
                : "border-gray-300"
            }`}
          >
            <img
              src={centerImage} // Example image, replace with dynamic center image if available
              alt={center.name}
              className="w-full h-20 object-cover rounded-md mb-2"
            />

            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-green-500 text-lg" />
              <h4 className="text-sm font-medium text-gray-800">
                {center.name}
              </h4>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {center.location
                ? `Location: ${center.location}`
                : "Location: Unknown"}
            </p>

            {/* Highlight the selected center */}
            {selectedCenter === center._id && (
              <div className="absolute inset-0 bg-green-100 bg-opacity-20 rounded-lg border-2 border-green-500 pointer-events-none"></div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 mb-4">
        <hr/>
      </div>
    </div>
  );
};

export default CenterSelection;
