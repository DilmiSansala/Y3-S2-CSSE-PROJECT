import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminAddCentreForm = ({ onCenterAdded, editCenter }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [operatingHours, setOperatingHours] = useState("");
  const [trucks, setTrucks] = useState(0);
  const [staff, setStaff] = useState(0);
  const [allocatedTrucks, setAllocatedTrucks] = useState(0); // New field
  const [allocatedStaff, setAllocatedStaff] = useState(0); // New field
  const [status, setStatus] = useState("active");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Populate the form fields if editing a center
    if (editCenter) {
      setName(editCenter.name);
      setLocation(editCenter.location);
      setCapacity(editCenter.capacity);
      setOperatingHours(editCenter.operatingHours);
      setTrucks(editCenter.resources.trucks);
      setStaff(editCenter.resources.staff);
      setAllocatedTrucks(editCenter.allocatedResources?.trucks || 0); // New field
      setAllocatedStaff(editCenter.allocatedResources?.staff || 0); // New field
      setStatus(editCenter.status);
    }
  }, [editCenter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const centerData = {
      name,
      location,
      capacity,
      operatingHours,
      resources: { trucks, staff },
      allocatedResources: {
        trucks: allocatedTrucks, // New field
        staff: allocatedStaff // New field
      },
      peakHours: editCenter?.peakHours || [], // Keep existing peakHours when editing
      status
    };

    try {
      let response;
      if (editCenter) {
        // Update the existing center
        response = await axios.put(
          `http://localhost:3050/api/centers/${editCenter._id}`,
          centerData
        );
      } else {
        // Add new center
        response = await axios.post(
          "http://localhost:3050/api/centers",
          centerData
        );
      }

      onCenterAdded(response.data); // Call the callback with the newly added/edited center data
    } catch (error) {
      setError("Failed to add/update collection centre.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">
        {editCenter ? "Edit Collection Center" : "Add Collection Center"}
      </h2>
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">Capacity</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Operating Hours</label>
          <input
            type="text"
            value={operatingHours}
            onChange={(e) => setOperatingHours(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">Number of Trucks</label>
          <input
            type="number"
            value={trucks}
            onChange={(e) => setTrucks(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Number of Staff</label>
          <input
            type="number"
            value={staff}
            onChange={(e) => setStaff(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
      </div>

      {/* New fields for allocated resources */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">Allocated Trucks</label>
          <input
            type="number"
            value={allocatedTrucks}
            onChange={(e) => setAllocatedTrucks(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Allocated Staff</label>
          <input
            type="number"
            value={allocatedStaff}
            onChange={(e) => setAllocatedStaff(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <button
        type="submit"
        className={`bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 ${
          loading ? "opacity-50" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Saving..." : editCenter ? "Update Centre" : "Add Centre"}
      </button>
    </form>
  );
};

export default AdminAddCentreForm;
