import { FaMapMarkerAlt } from "react-icons/fa";
import centerImage from "../assets/center.jpg"; // Example image for the center

const CenterSelection = ({ centers, selectedCenter, setSelectedCenter }) => {
  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
        {centers.map((center) => (
          <div
            key={center._id}
            onClick={() => setSelectedCenter(center._id)}
            className={`relative cursor-pointer bg-white rounded-lg shadow-md p-1 md:p-2 border ${
              selectedCenter === center._id
                ? "border-green-500 ring-2 ring-green-300"
                : "border-gray-300"
            } transform transition duration-300 hover:scale-105`}
          >
            <img
              src={centerImage}
              alt={center.name}
              className="w-full h-16 md:h-20 object-cover rounded-md mb-1"
            />
            <div className="flex items-center space-x-1">
              <FaMapMarkerAlt className="text-green-500 text-sm md:text-md" />
              <h4 className="text-xs md:text-sm font-medium text-gray-800">
                {center.name}
              </h4>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {center.location || "Unknown"}
            </p>

            {/* Highlight the card when selected */}
            {selectedCenter === center._id && (
              <div className="absolute inset-0 bg-green-100 bg-opacity-20 rounded-lg border-2 border-green-500 pointer-events-none"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CenterSelection;
