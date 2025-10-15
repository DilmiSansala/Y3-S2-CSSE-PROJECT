import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminDashboardLayout from "./AdminDashboardLayout";
import "./AdminResourceAllocation.css"; // Import custom CSS for styling

const AdminResourceAllocation = () => {
  const [centers, setCenters] = useState([]);
  const [peakPeriods, setPeakPeriods] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCentersAndPeakPeriods();
  }, []);

  const fetchCentersAndPeakPeriods = async () => {
    try {
      const centersResponse = await axios.get(
        "http://localhost:3050/api/centers"
      );
      setCenters(centersResponse.data);

      const peakPeriodsResponse = await axios.get(
        "http://localhost:3050/api/centers/peak-monitoring"
      );
      setPeakPeriods(peakPeriodsResponse.data);
    } catch (error) {
      setError("Failed to fetch data.");
    }
  };

  const allocateResources = async () => {
    try {
      await axios.post("http://localhost:3050/api/centers/allocate-resources", {
        peakPeriods // Send peak periods data in the body
      });
      alert("Resources allocated successfully.");
      fetchCentersAndPeakPeriods(); // Refresh data
    } catch (error) {
      setError("Failed to allocate resources.");
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="admin-resource-allocation">
        <h1 className="title">Resource Allocation</h1>
        {error && <div className="error-message">{error}</div>}
        <button className="allocate-button" onClick={allocateResources}>
          Allocate Resources
        </button>
        <div className="table-container">
          <table className="resource-table">
  <thead>
    <tr>
      <th>Center Name</th>
      <th>Allocated Trucks</th>
      <th>Allocated Staff</th>
      <th>Total Quantity (kg)</th>
    </tr>
  </thead>
  <tbody>
    {centers.map(c => (
      <tr key={c._id}>
        <td>{c.name}</td>
        <td>{c.allocatedResources?.trucks || 0}</td>
        <td>{c.allocatedResources?.staff || 0}</td>
        <td>{c.allocatedResources?.totalQuantity || 0}</td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminResourceAllocation;
