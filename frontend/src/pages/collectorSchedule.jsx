/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation

function CollectorSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const collectorId = localStorage.getItem("collectorId");

    if (!token || !collectorId) {
      setError("Collector not logged in. Redirecting to login...");
      setTimeout(() => navigate("/collector-signin"), 2000);
      return;
    }

    const fetchSchedules = async () => {
      try {
        const response = await axios.get(`http://localhost:3050/api/schedule/collector/${collectorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchedules(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching schedules.");
        setLoading(false);
      }
    };

    if (collectorId) {
      fetchSchedules();
    }
  }, [navigate]);

  // Function to accept schedule
  const acceptSchedule = async (scheduleId) => {
    const token = localStorage.getItem("authToken");

    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.put(
        `http://localhost:3050/api/schedule/accept/${scheduleId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSchedules((prevSchedules) =>
        prevSchedules.map((schedule) => (schedule._id === scheduleId ? { ...schedule, status: "accepted" } : schedule))
      );
    } catch (err) {
      console.error("Error accepting schedule:", err);
      setError("Error accepting schedule.");
    }
  };

  // Function to cancel schedule
  const cancelSchedule = async (scheduleId) => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.put(
        `http://localhost:3050/api/schedule/cancel/${scheduleId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSchedules((prevSchedules) =>
        prevSchedules.map((schedule) => (schedule._id === scheduleId ? { ...schedule, status: "canceled" } : schedule))
      );
    } catch (err) {
      console.error("Error canceling schedule:", err);
      setError("Error canceling schedule.");
    }
  };

  if (loading) {
    return <div>Loading schedules...</div>;
  }

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

  if (!schedules.length) {
    return <div>No schedules found.</div>;
  }

  return (
    <div className='px-40 py-6 mx-auto containerp'>
      <h1 className='mb-6 text-3xl font-bold text-center'>Your Collection Schedule</h1>

      <table className='w-full bg-white rounded-lg shadow-lg table-auto'>
        <thead>
          <tr className='text-white bg-green-600'>
            <th className='px-4 py-2'>Route</th>
            <th className='px-4 py-2'>Vehicle</th>
            <th className='px-4 py-2'>Vehicle License Plate </th>
            <th className='px-4 py-2'>Date</th>
            <th className='px-4 py-2'>Time</th>
            <th className='px-4 py-2'>Status</th>
            <th className='px-4 py-2'>Action</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule, index) => (
            <tr key={schedule._id} className='border-b'>
              <td className='px-4 py-2 text-center'>Route {index + 1}</td>

              <td className='px-4 py-2 text-center'>{schedule.vehicle.name}</td>
              <td className='px-4 py-2 text-center'>{schedule.vehicle.licensePlate}</td>
              <td className='px-4 py-2 text-center'>{new Date(schedule.date).toLocaleDateString()}</td>
              <td className='px-4 py-2 text-center'>{schedule.time}</td>
              <td className='px-4 py-2 text-center'>
                {schedule.status === "scheduled" && <span className='px-2 py-1 text-blue-700 bg-blue-200 rounded-full'>Scheduled</span>}
                {schedule.status === "completed" && <span className='px-2 py-1 text-green-700 bg-green-200 rounded-full'>Completed</span>}
                {schedule.status === "accepted" && <span className='px-2 py-1 text-green-700 bg-green-200 rounded-full'>Accepted</span>}
                {schedule.status === "canceled" && <span className='px-2 py-1 text-red-700 bg-red-200 rounded-full'>Canceled</span>}
              </td>
              <td className='px-4 py-2 text-center'>
                {schedule.status === "scheduled" && (
                  <button onClick={() => acceptSchedule(schedule._id)} className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600'>
                    Accept
                  </button>
                )}
                {schedule.status === "accepted" && (
                  <button onClick={() => cancelSchedule(schedule._id)} className='px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600'>
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CollectorSchedule;
