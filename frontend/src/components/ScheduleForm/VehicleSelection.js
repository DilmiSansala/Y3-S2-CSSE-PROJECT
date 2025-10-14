import React from "react";
import { FaTruck } from "react-icons/fa"; // Icon for vehicle
import vehicleImage from "../assets/vehicle.jpg"; // Example image for the vehicle

const VehicleSelection = ({
  vehicles,
  selectedVehicle,
  setSelectedVehicle,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Select a Vehicle:
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle._id}
            onClick={() => setSelectedVehicle(vehicle._id)} // Set the selected vehicle on click
            className={`relative cursor-pointer p-2 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 border-2 ${
              selectedVehicle === vehicle._id
                ? "border-green-500 ring-2 ring-green-300"
                : "border-gray-300"
            }`}
          >
            <img
              src={vehicleImage} // Example image, replace with dynamic vehicle image if available
              alt={vehicle.name}
              className="w-full h-20 object-cover rounded-md mb-2"
            />

            <div className="flex items-center space-x-2">
              <FaTruck className="text-green-500 text-lg" />
              <h4 className="text-sm font-medium text-gray-800">
                {vehicle.name}
              </h4>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              License Plate: {vehicle.licensePlate}
            </p>

            {/* Highlight the selected vehicle */}
            {selectedVehicle === vehicle._id && (
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

export default VehicleSelection;
