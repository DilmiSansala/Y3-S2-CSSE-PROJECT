import React from "react";
import { FaTrash, FaClock, FaWeightHanging, FaUserAlt } from "react-icons/fa"; // Importing icons
import wasteImage from "../assets/waste.jpg"; // Example waste image

const RequestList = ({ requests }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {requests.map((request) => (
        <div
          key={request._id}
          className="relative bg-white p-6 rounded-lg shadow-lg border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl"
        >
          {/* Waste Image */}
          <img
            src={wasteImage}
            alt="Waste Type"
            className="w-full h-40 object-cover rounded-t-lg mb-4"
          />

          {/* Request Details */}
          <div className="space-y-3">
            <p className="flex items-center text-lg text-gray-700">
              <FaTrash className="text-green-600 mr-2" />
              <strong>Waste Type:</strong> {request.wasteType}
            </p>
            <p className="flex items-center text-lg text-gray-700">
              <FaWeightHanging className="text-green-600 mr-2" />
              <strong>Quantity:</strong> {request.quantity} kg
            </p>
            <p className="flex items-center text-lg text-gray-700">
              <FaClock className="text-green-600 mr-2" />
              <strong>Collection Time:</strong> {request.collectionTime}
            </p>
          </div>


        </div>
      ))}
    </div>
  );
};

export default RequestList;
