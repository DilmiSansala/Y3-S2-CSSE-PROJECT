import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminDashboardLayout from "../pages/AdminDashboardLayout";
import AdminAddCentreForm from "../components/AdminAddCentreForm";
import "./AdminCollectionCentres.css"; // Import custom CSS for styling

const AdminCollectionCentres = () => {
  const [centres, setCentres] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false); // State to control form visibility
  const [error, setError] = useState("");
  const [editCenter, setEditCenter] = useState(null); // State to hold the center being edited

  useEffect(() => {
    fetchCentres();
  }, []);

  const fetchCentres = async () => {
    try {
      const response = await axios.get("http://localhost:3050/api/centers");
      setCentres(response.data);
    } catch (error) {
      setError("Failed to fetch collection centres.");
    }
  };

  const handleCenterAdded = (newCenter) => {
    if (editCenter) {
      // Update the existing center in the list
      setCentres(
        centres.map((centre) =>
          centre._id === newCenter._id ? newCenter : centre
        )
      );
    } else {
      // Add new center to the list
      setCentres([...centres, newCenter]);
    }

    setIsFormVisible(false); // Hide form after center is added/edited
    setEditCenter(null); // Clear the edit state
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3050/api/centers/${id}`);
      setCentres(centres.filter((centre) => centre._id !== id)); // Remove deleted center from the list
    } catch (error) {
      setError("Failed to delete collection centre.");
    }
  };

  const handleEdit = (centre) => {
    setEditCenter(centre); // Set the center to be edited
    setIsFormVisible(true); // Show the form for editing
  };

  // Render status with green dot for active and red dot for inactive
  const renderStatus = (status) => (
    <span className="flex items-center">
      <span
        className={`inline-block w-2 h-2 mr-2 rounded-full ${
          status === "active" ? "bg-green-500" : "bg-red-500"
        }`}
      ></span>
      {status}
    </span>
  );

  return (
    <AdminDashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Collection Centres</h1>
      {error && <div className="text-red-600">{error}</div>}

      <div className="mt-6">
        <button
          onClick={() => {
            setIsFormVisible(true);
            setEditCenter(null); // Reset the edit state for adding new center
          }} // Show the form for adding a new center
          className="add-button"
        >
          Add Collection Centre
        </button>

        {centres.length === 0 ? (
          <p className="mt-4">No collection centres available.</p>
        ) : (
          <table className="collection-centres-table min-w-full table-auto mt-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Capacity (tons)</th>
                <th>Operating Hours</th>
                <th>Trucks</th>
                <th>Staff</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {centres.map((centre) => (
                <tr key={centre._id} className="border-t">
                  <td>{centre.name}</td>
                  <td>{centre.location}</td>
                  <td>{centre.capacity}</td>
                  <td>{centre.operatingHours}</td>
                  <td>{centre.resources.trucks}</td>
                  <td>{centre.resources.staff}</td>
                  <td>{renderStatus(centre.status)}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(centre)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(centre._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Inline Form for Adding/Editing Collection Center */}
        {isFormVisible && (
          <div className="form-modal">
            <div className="form-container">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsFormVisible(false)} // Hide form on close
                  className="close-button"
                >
                  &times;
                </button>
              </div>
              <AdminAddCentreForm
                onCenterAdded={handleCenterAdded}
                editCenter={editCenter} // Pass the center to be edited to the form
              />
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminCollectionCentres;
