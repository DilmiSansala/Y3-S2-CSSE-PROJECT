import React, { useState, useEffect } from "react";
import axios from "axios";
import SidebarIcon from "../components/sidebar/SidebarIcon";
import Header from "../components/header/Header";
import Footer from "../components/Footer";
import "../components/sidebar/styles.css";
import "./wasteHistory.css";
import withAuth from "../hoc/withAuth";

// Define the WasteHistory component
function WasteHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [wasteData, setWasteData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);

  // Fetch waste data from the backend
  const fetchWasteData = async () => {
    setLoading(true);
    setError(null); // Reset error state before fetching
    try {
      const response = await axios.get(
        "http://localhost:3050/api/auth/waste/history",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setWasteData(response.data);
    } catch (err) {
      console.error("Error fetching waste data:", err);
      setError("Failed to fetch waste data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWasteData();
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle waste request delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3050/api/auth/waste/request/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setWasteData(wasteData.filter((request) => request._id !== id));
    } catch (err) {
      console.error("Error deleting waste request:", err);
    }
  };

  // Handle waste request edit (simplified form)
  const handleEdit = (request) => {
    setEditingRequest(request);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3050/api/auth/waste/request/${editingRequest._id}`,
        editingRequest,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setWasteData(
        wasteData.map((request) =>
          request._id === editingRequest._id ? response.data : request
        )
      );
      setEditingRequest(null); // Clear the editing form
    } catch (err) {
      console.error("Error updating waste request:", err);
    }
  };

  // Filter waste data based on search query
  const filteredData = wasteData.filter((entry) =>
    entry.wasteType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="waste-history-container">
      <SidebarIcon />
      <div className="main-content-history">
        <Header />
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by waste type..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-bar"
            aria-label="Search by waste type"
          />
        </div>
        <div className="table-container">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <table className="waste-history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Type of Waste</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((entry, index) => (
                    <tr key={index}>
                      <td>
                        {new Date(entry.collectionDate).toLocaleDateString()}
                      </td>
                      <td>{entry.collectionTime}</td>
                      <td>{entry.wasteType}</td>
                      <td>{entry.quantity}</td>
                      <td className={`status ${entry.status.toLowerCase()}`}>
                        {entry.status}
                      </td>
                      <td>
                        <button
                          className="action-button edit-button"
                          onClick={() => handleEdit(entry)}
                        >
                          Edit
                        </button>
                        <button
                          className="action-button delete-button"
                          onClick={() => handleDelete(entry._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {editingRequest && (
          <form onSubmit={handleEditSubmit} className="edit-form-container">
            <h3>Edit Waste Request</h3>
            <input
              type="text"
              value={editingRequest.wasteType}
              onChange={(e) =>
                setEditingRequest({
                  ...editingRequest,
                  wasteType: e.target.value,
                })
              }
            />
            <input
              type="number"
              value={editingRequest.quantity}
              onChange={(e) =>
                setEditingRequest({
                  ...editingRequest,
                  quantity: e.target.value,
                })
              }
            />
            <input
              type="date"
              value={new Date(editingRequest.collectionDate)
                .toISOString()
                .split("T")[0]}
              onChange={(e) =>
                setEditingRequest({
                  ...editingRequest,
                  collectionDate: e.target.value,
                })
              }
            />
            <input
              type="time"
              value={editingRequest.collectionTime}
              onChange={(e) =>
                setEditingRequest({
                  ...editingRequest,
                  collectionTime: e.target.value,
                })
              }
            />
            <button type="submit" className="submit-button">
              Submit Changes
            </button>
          </form>
        )}
        <Footer />
      </div>
    </div>
  );
}

export default withAuth(WasteHistory);
