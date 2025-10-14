// src/pages/AdminCentreDetails.js
import React from "react";
import AdminDashboardLayout from "../pages/AdminDashboardLayout";

const AdminCentreDetails = () => {
  return (
    <AdminDashboardLayout>
      <h1 className="text-2xl font-bold">Admin Centre Details</h1>
      {/* Add your centre details content here */}
      <div className="mt-6">{/* Centre details data */}</div>
    </AdminDashboardLayout>
  );
};

export default AdminCentreDetails;
