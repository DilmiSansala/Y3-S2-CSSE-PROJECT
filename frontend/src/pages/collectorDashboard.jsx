import React, { useEffect, useState } from "react";
import axios from "axios";

const CollectorDashboard = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch requests and calculate progress
    const token = localStorage.getItem("authToken");
    axios
      .get("http://localhost:3050/api/requests/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = response.data;
        // Group requests by date and calculate progress
        const groupedRoutes = groupRoutesByDate(data);
        setRoutes(groupedRoutes);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching routes:", error);
        setLoading(false);
      });
  }, []);

  const groupRoutesByDate = (requests) => {
    const grouped = {};
    requests.forEach((request) => {
      const date = new Date(request.collectionDate).toDateString();
      if (!grouped[date]) {
        grouped[date] = { completed: 0, total: 0 };
      }
      grouped[date].total += 1;
      if (request.status === "collected") {
        grouped[date].completed += 1;
      }
    });
    return Object.keys(grouped).map((date) => ({
      date,
      completed: grouped[date].completed,
      total: grouped[date].total,
    }));
  };

  const getProgress = (completed, total) => {
    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container px-20 py-10 mx-auto'>
      <h1 className='mb-6 text-4xl font-bold text-green-700'>Collector Dashboard</h1>

      {/* Dashboard Overview Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        {/* Routes Overview */}
        <div className='p-6 bg-green-100 rounded-lg shadow-lg'>
          <h2 className='mb-4 text-2xl font-semibold'>Today Schedule</h2>
          <p className='text-green-700'>You have 3 active routes assigned for today.</p>
          <button
            className='px-4 py-2 mt-4 text-white bg-green-600 rounded-full hover:bg-green-700'
            onClick={() => (window.location.href = "/collector/schedule")}>
            View Schedule
          </button>
        </div>

        {/* Collection Progress */}
        <div className='p-6 bg-green-100 rounded-lg shadow-lg'>
          <h2 className='mb-4 text-2xl font-semibold'>Collection Progress</h2>
          <p className='text-green-700'>Today’s progress.</p>
          <button
            className='px-4 py-2 mt-4 text-white bg-green-600 rounded-full hover:bg-green-700'
            onClick={() => (window.location.href = "/collector/progress")}>
            View Progress
          </button>
        </div>

        {/* Notifications
        <div className="p-6 bg-green-100 rounded-lg shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold">Notifications</h2>
          <p className="text-green-700">You have 2 new notifications.</p>
          <button className="px-4 py-2 mt-4 text-white bg-green-600 rounded-full hover:bg-green-700">
            View Notifications
          </button>
        </div> */}
      </div>

      {/* Routes Table */}
      <div className='mt-8'>
        <h2 className='mb-4 text-3xl font-bold text-green-700'>All schedules</h2>
        <table className='min-w-full overflow-hidden bg-white rounded-lg shadow-md'>
          <thead className='text-white bg-green-600'>
            <tr>
              <th className='w-1/3 px-4 py-3 text-sm font-semibold text-left uppercase'>Date</th>
              <th className='w-1/3 px-4 py-3 text-sm font-semibold text-left uppercase'>Status</th>
              <th className='w-1/3 px-4 py-3 text-sm font-semibold text-left uppercase'>Progress</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-green-50" : "bg-white"}>
                <td className='w-1/3 px-4 py-3 text-left'>{route.date}</td>
                <td className='w-1/3 px-4 py-3 text-left'>{route.completed === route.total ? "Completed" : "In Progress"}</td>
                <td className='w-1/3 px-4 py-3 text-left'>
                  <div className='relative pt-1'>
                    <div className='flex items-center justify-between mb-2'>
                      <div>
                        <span className='inline-block px-2 py-1 text-xs font-semibold text-green-600 uppercase bg-green-200 rounded-full'>
                          {getProgress(route.completed, route.total)}%
                        </span>
                      </div>
                      <div className='text-right'>
                        <span className='inline-block text-xs font-semibold text-green-600'>
                          {route.completed}/{route.total}
                        </span>
                      </div>
                    </div>
                    <div className='flex h-2 mb-4 overflow-hidden text-xs bg-green-200 rounded'>
                      <div
                        style={{ width: `${getProgress(route.completed, route.total)}%` }}
                        className='flex flex-col justify-center text-center text-white bg-green-500 shadow-none whitespace-nowrap'></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollectorDashboard;
