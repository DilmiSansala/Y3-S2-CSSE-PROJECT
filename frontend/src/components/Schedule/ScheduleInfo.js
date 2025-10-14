import { FaUser, FaMapMarkerAlt, FaTruck, FaClock, FaClipboardCheck } from "react-icons/fa"; // Importing icons
import collectorImage from "../assets/collector.jpg"; // Example collector image
import vehicleImage from "../assets/vehicle.jpg"; // Example vehicle image

// Component to display the schedule details
const ScheduleInfo = ({ scheduleInfo }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg mb-10 border border-green-500 transform transition duration-300 hover:scale-105">
      <h3 className="text-2xl font-bold text-green-700 mb-6 text-center">
        Schedule Details
      </h3>
      
      <div className="grid grid-cols-2 gap-8">
        {/* Collector Info */}
        <div className="flex items-center space-x-4">
          <img src={collectorImage} alt="Collector" className="w-16 h-16 rounded-full object-cover shadow-md" />
          <div>
            <p className="text-lg font-medium text-gray-800 flex items-center">
              <FaUser className="mr-2 text-green-600" />
              {scheduleInfo.collector.name}
            </p>
            <p className="text-sm text-gray-500">Collector</p>
          </div>
        </div>

        {/* Collection Center Info */}
        <div className="flex items-center space-x-4">
          <FaMapMarkerAlt className="text-4xl text-green-600" />
          <div>
            <p className="text-lg font-medium text-gray-800">{scheduleInfo.center.name}</p>
            <p className="text-sm text-gray-500">Collection Center</p>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="flex items-center space-x-4">
          <img src={vehicleImage} alt="Vehicle" className="w-16 h-16 object-cover shadow-md rounded-lg" />
          <div>
            <p className="text-lg font-medium text-gray-800 flex items-center">
              <FaTruck className="mr-2 text-green-600" />
              {scheduleInfo.vehicle.name}
            </p>
            <p className="text-sm text-gray-500">License: {scheduleInfo.vehicle.licensePlate}</p>
          </div>
        </div>

        {/* Time Slot Info */}
        <div className="flex items-center space-x-4">
          <FaClock className="text-4xl text-green-600" />
          <div>
            <p className="text-lg font-medium text-gray-800">{scheduleInfo.time}</p>
            <p className="text-sm text-gray-500">Time Slot</p>
          </div>
        </div>

        {/* Status Info */}
        <div className="flex items-center space-x-4 col-span-2 justify-center">
          <FaClipboardCheck className="text-4xl text-green-600" />
          <div>
            <p className="text-lg font-medium text-gray-800">{scheduleInfo.status}</p>
            <p className="text-sm text-gray-500">Schedule Status</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInfo;