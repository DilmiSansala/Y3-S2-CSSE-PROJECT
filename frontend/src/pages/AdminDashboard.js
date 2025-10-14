import React from "react";
import AdminDashboardLayout from "./AdminDashboardLayout";
import "./AdminDashboard.css"; // Custom CSS for the dashboard
import heroImage from "../images/hero.png";

// Import relevant icons from react-icons
import {
  FaClipboardList,
  FaExclamationTriangle,
  FaTruck,
  FaTrash
} from "react-icons/fa";

const AdminDashboard = () => {
  return (
    <AdminDashboardLayout>
      {/* Hero Section */}
      <div
        className="hero-section mb-10 p-6 bg-cover bg-center rounded-lg shadow-lg relative"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "400px",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg"></div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            Welcome to Your Waste Management Dashboard
          </h1>
          <p className="text-lg text-white mt-2 drop-shadow-lg">
            Monitor waste collection centers, manage resources, and track issues
            efficiently.
          </p>
        </div>
      </div>

      {/* Add margin between the hero section and widgets */}
      <div className="mt-10" />

      {/* Dashboard Widgets Section */}
      <div className="dashboard-widgets grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Total Waste Requests */}
        <div className="widget bg-purple-200 border-l-4 border-green-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:scale-105">
          <FaClipboardList className="text-green-700 text-7xl mb-4" />{" "}
          {/* Icon representing waste requests */}
          <h2 className="text-xl font-semibold">Total Waste Requests</h2>
          <p className="text-lg font-bold">500 Requests</p>
        </div>

        {/* Pending Collection Requests */}
        <div className="widget bg-yellow-200 border-l-4 border-yellow-600 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:scale-105">
          <FaExclamationTriangle className="text-yellow-600 text-7xl mb-4" />{" "}
          {/* Alert icon for pending collections */}
          <h2 className="text-xl font-semibold">Pending Collection Requests</h2>
          <p className="text-lg font-bold">30 Requests</p>
        </div>

        {/* Resources Allocated */}
        <div className="widget bg-blue-200 border-l-4 border-blue-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:scale-105">
          <FaTruck className="text-blue-700 text-7xl mb-4" />{" "}
          {/* Truck icon for resource allocation */}
          <h2 className="text-xl font-semibold">Resources</h2>
          <p className="text-lg font-bold">30 Trucks, 60 Staff</p>
        </div>

        {/* Garbage Collected */}
        <div className="widget bg-gray-200 border-l-4 border-gray-600 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:scale-105">
          <FaTrash className="text-gray-600 text-7xl mb-4" />{" "}
          {/* Trash icon for garbage collected */}
          <h2 className="text-xl font-semibold">Total Garbage Collected</h2>
          <p className="text-lg font-bold">400 Tons</p>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
