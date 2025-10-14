import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import Footer from "../components/Footer"; // Import Footer component

const AdminDashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {/* Admin Sidebar */}
        <div
          style={{ backgroundColor: "#fff" }}
          className="flex-shrink-0 min-h-screen"
        >
          <AdminSidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 p-10 text-gray-900">{children}</div>
      </div>
      {/* Footer */}
      <Footer /> {/* Footer will always be at the bottom */}
    </div>
  );
};

export default AdminDashboardLayout;
