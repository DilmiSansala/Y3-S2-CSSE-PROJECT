// components/CollectorLayout.js
import React from "react";
import CollectorHeader from "./collectorHeader"; // Import the CollectorHeader component

function CollectorLayout({ children }) {
  return (
    <div>
      <CollectorHeader /> {/* Header is included on every page */}
      <main className='container p-4 mx-auto'>{children}</main> {/* Page content goes here */}
    </div>
  );
}

export default CollectorLayout;
