import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBuilding,
  FaChartLine,
  FaSignOutAlt,
  FaTruck,
  FaBars,
  FaClipboardList
} from "react-icons/fa"; // Import icons from react-icons
import logo from "../images/leaf.png"; // Ensure the correct path to your logo is provided

const AdminSidebar = () => {
  const navigate = useNavigate(); // For redirecting after logout
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar for mobile

  const handleLogout = () => {
    // Clear the user from localStorage (you can add auth logic here if needed)
    localStorage.removeItem("user");
    // Redirect to the home page after logout
    navigate("/");
  };

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Hamburger Menu for Mobile */}
      <button
        className="md:hidden text-white bg-green-600 p-3"
        onClick={toggleSidebar}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 bg-white text-green-800 h-full p-4 flex flex-col justify-between transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative`}
      >
        <div>
          {/* Only Logo at the Top */}
          <div className="flex items-center justify-center mb-6">
            <img src={logo} alt="Zero-Waste Logo" className="w-44 h-16" />
          </div>

          <ul className="space-y-4">
            <li>
              <Link
                to="/admin-dashboard"
                className="flex items-center text-[#185233] hover:bg-gray-100 px-4 py-2 rounded-md"
              >
                <FaTachometerAlt className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin-centres"
                className="flex items-center text-[#185233] hover:bg-gray-100 px-4 py-2 rounded-md"
              >
                <FaBuilding className="mr-3" />
                Collection Centres
              </Link>
            </li>
            <li>
              <Link
                to="/admin-peak-monitoring"
                className="flex items-center text-[#185233] hover:bg-gray-100 px-4 py-2 rounded-md"
              >
                <FaChartLine className="mr-3" />
                Peak Monitoring
              </Link>
            </li>
            <li>
              <Link
                to="/admin-allocate-resources"
                className="flex items-center text-[#185233] hover:bg-gray-100 px-4 py-2 rounded-md"
              >
                <FaTruck className="mr-3" />
                Resource Allocation
              </Link>
            </li>
            <li className="mb-2">
            <Link
              to="/schedulePage"
              className="flex items-center text-[#185233] hover:bg-gray-100 px-4 py-2 rounded-md"
            >
              <FaClipboardList className="mr-3" />
              Schedules
            </Link>
          </li>
            <li>
              <div
                onClick={handleLogout}
                className="flex items-center text-[#185233] hover:bg-gray-100 px-4 py-2 rounded-md cursor-pointer"
              >
                <FaSignOutAlt className="mr-3" />
                Logout
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Content Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default AdminSidebar;
