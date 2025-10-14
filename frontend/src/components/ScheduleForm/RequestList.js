import { FaTrash, FaClock, FaUserAlt, FaWeightHanging } from "react-icons/fa"; // Importing icons
import wasteImage from "../assets/waste.jpg"; // Example image for waste type

const RequestList = ({ filteredRequests, handleRequestSelection }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
        <FaTrash className="text-green-600 mr-2" /> Filtered Pending Waste
        Requests
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {filteredRequests.map((request) => (
          <div
            key={request._id}
            className="relative bg-white p-2 rounded-lg shadow-md border border-gray-200 transition transform hover:scale-105 hover:shadow-lg"
          >
            {/* Waste Type Image */}
            <img
              src={wasteImage}
              alt="Waste Type"
              className="w-full h-20 object-cover rounded-md mb-2"
            />

            {/* Request Details */}
            <div className="space-y-1 text-sm">
              <p className="flex items-center text-gray-700">
                <FaUserAlt className="text-green-600 mr-1" />
                <strong>Resident:</strong> {request.resident.residentName}
              </p>
              <p className="flex items-center text-gray-700">
                <FaTrash className="text-green-600 mr-1" />
                <strong>Waste Type:</strong> {request.wasteType}
              </p>
              <p className="flex items-center text-gray-700">
                <FaWeightHanging className="text-green-600 mr-1" />
                <strong>Quantity:</strong> {request.quantity}
              </p>
              <p className="flex items-center text-gray-700">
                <FaClock className="text-green-600 mr-1" />
                <strong>Collection Time:</strong> {request.collectionTime}
              </p>
            </div>

            {/* Checkbox for Selection */}
            <div className="absolute bottom-2 right-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                onChange={(e) => handleRequestSelection(e, request._id)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 mb-4">
        <hr/>
      </div>
    </div>
  );
};

export default RequestList;
