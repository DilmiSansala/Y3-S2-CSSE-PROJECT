// routes/CollectorRoutes.js
import React from "react";
import { Outlet } from "react-router-dom";  // Outlet will render nested routes
import CollectorHeader from "../components/collectorHeader";
import Footer from "../components/Footer";


const CollectorRoutes = () => {
  return (
    <div>
      <CollectorHeader />
      <Outlet /> {/* Renders the nested route component */}
      <Footer />
    </div>
  );
};

export default CollectorRoutes;
