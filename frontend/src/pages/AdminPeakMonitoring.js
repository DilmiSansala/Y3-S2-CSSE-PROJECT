import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import AdminDashboardLayout from "../pages/AdminDashboardLayout";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import "./AdminPeakMonitoring.css"; // Import custom CSS for styling

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminPeakMonitoring = () => {
  const [peakPeriods, setPeakPeriods] = useState([]);
  const [centers, setCenters] = useState([]); // List of centers for the dropdown
  const [selectedCenter, setSelectedCenter] = useState("All"); // Default to 'All' centers
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPeakPeriods(); // Fetch peak periods data
    fetchCenters(); // Fetch centers for the dropdown
  }, []);

  // Function to fetch peak periods
  const fetchPeakPeriods = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3050/api/centers/peak-monitoring"
      );
      setPeakPeriods(response.data);
    } catch (error) {
      setError("Failed to fetch peak collection periods.");
    }
  };

  // Function to fetch centers
  const fetchCenters = async () => {
    try {
      const response = await axios.get("http://localhost:3050/api/centers");
      setCenters(response.data);
    } catch (error) {
      setError("Failed to fetch centers.");
    }
  };

  // Filter the peak periods based on the selected center
  const filteredPeriods =
    selectedCenter === "All"
      ? peakPeriods
      : peakPeriods.filter((period) => period.center === selectedCenter);

  // Prepare the data for the chart based on the filtered data
  const datesTimes = filteredPeriods.map(
    (period) => `${period.date} ${period.time}`
  ); // Combine date and time for x-axis
  const quantities = filteredPeriods.map((period) => period.totalQuantity); // Total quantities

  const data = {
    labels: datesTimes, // x-axis (date + time)
    datasets: [
      {
        label: `Total Waste Collected (kg) - ${selectedCenter}`,
        data: quantities, // y-axis (total quantities)
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: `Peak Collection Monitoring (${selectedCenter})`
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date and Time"
        },
        ticks: {
          maxTicksLimit: 15 // Control how many ticks are displayed on the x-axis
        }
      },
      y: {
        title: {
          display: true,
          text: "Total Waste Collected (kg)"
        }
      }
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="admin-peak-monitoring">
        <h1 className="title">Peak Collection Monitoring</h1>
        {error && <div className="error-message">{error}</div>}

        {/* Dropdown to select center */}
        <div className="dropdown-container">
          <label className="dropdown-label">Filter by Center</label>
          <select
            value={selectedCenter}
            onChange={(e) => setSelectedCenter(e.target.value)} // Set the selected center
            className="dropdown"
          >
            <option value="All">All</option>
            {centers.map((center) => (
              <option key={center._id} value={center.name}>
                {center.name}
              </option>
            ))}
          </select>
        </div>

        {peakPeriods.length === 0 ? (
          <p className="no-data-message">No data available.</p>
        ) : (
          <div className="chart-and-table-container">
            {/* Render the Line Chart */}
            <div className="chart-container">
              <Line data={data} options={options} />
            </div>

            {/* Display peak periods in a table */}
            <table className="peak-table">
              <thead>
                <tr>
                  <th>Center</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Total Quantity (kg)</th>
                </tr>
              </thead>
              <tbody>
                {filteredPeriods.map((period, index) => (
                  <tr key={index}>
                    <td>{period.center}</td>
                    <td>{period.date}</td>
                    <td>{period.time}</td>
                    <td>{period.totalQuantity} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminPeakMonitoring;
