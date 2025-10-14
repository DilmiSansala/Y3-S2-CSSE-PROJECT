import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import dashboardIcon from "../../images/dashboard.png";
import itemsIcon from "../../images/items.png";
import analyticsIcon from "../../images/analytics.png";
import feedbackIcon from "../../images/feedback.png";
import profileIcon from "../../images/profile.png";
import logoutIcon from "../../images/logout.png";
import Logo from "../../images/leaf.png"; 

// Constants for routes and labels
const ROUTES = {
  dashboard: "/resident-home",
  profile: "/resident-profile",
  payment: "/payment",
  requests: "/resident-request",
  progress: "/waste-progress",
  history: "/resident-history",
  logout: "/logout",
};

// Constants for sidebar labels
const LABELS = {
  dashboard: "Dashboard",
  profile: "Profile",
  payment: "Payment",
  requests: "Requests",
  progress: "Progress",
  history: "Collection History",
  logout: "Logout",
};

const SidebarIcon = () => {
  const [activeLink, setActiveLink] = useState(ROUTES.dashboard); // Default to Dashboard

  // Function to handle sidebar link clicks
  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <div className="sidebar">
      <div className="box-above-dashboard">
        <img src={Logo} alt="Logo" className="shop-logo" />
      </div>

      {/* Sidebar Links */}
      <Link
        to={ROUTES.dashboard}
        className={activeLink === ROUTES.dashboard ? "active" : ""}
        onClick={() => handleLinkClick(ROUTES.dashboard)}
        aria-label={LABELS.dashboard}
      >
        <img src={dashboardIcon} alt={LABELS.dashboard} className="sidebar-icon" />
        {LABELS.dashboard}
      </Link>

      <Link
        to={ROUTES.profile}
        className={activeLink === ROUTES.profile ? "active" : ""}
        onClick={() => handleLinkClick(ROUTES.profile)}
        aria-label={LABELS.profile}
      >
        <img src={profileIcon} alt={LABELS.profile} className="sidebar-icon" />
        {LABELS.profile}
      </Link>

      <Link
        to={ROUTES.payment}
        className={activeLink === ROUTES.payment ? "active" : ""}
        onClick={() => handleLinkClick(ROUTES.payment)}
        aria-label={LABELS.payment}
      >
        <img src={itemsIcon} alt={LABELS.payment} className="sidebar-icon" />
        {LABELS.payment}
      </Link>

      <Link
        to={ROUTES.requests}
        className={activeLink === ROUTES.requests ? "active" : ""}
        onClick={() => handleLinkClick(ROUTES.requests)}
        aria-label={LABELS.requests}
      >
        <img src={analyticsIcon} alt={LABELS.requests} className="sidebar-icon" />
        {LABELS.requests}
      </Link>

      <Link
        to={ROUTES.progress}
        className={activeLink === ROUTES.progress ? "active" : ""}
        onClick={() => handleLinkClick(ROUTES.progress)}
        aria-label={LABELS.progress}
      >
        <img src={feedbackIcon} alt={LABELS.progress} className="sidebar-icon" />
        {LABELS.progress}
      </Link>

      <Link
        to={ROUTES.history}
        className={activeLink === ROUTES.history ? "active" : ""}
        onClick={() => handleLinkClick(ROUTES.history)}
        aria-label={LABELS.history}
      >
        <img src={feedbackIcon} alt={LABELS.history} className="sidebar-icon" />
        {LABELS.history}
      </Link>

      <div className="sidebar-spacer"></div>

      <Link
        to={ROUTES.logout}
        className={activeLink === ROUTES.logout ? "active" : ""}
        onClick={() => handleLinkClick(ROUTES.logout)}
        aria-label={LABELS.logout}
      >
        <img src={logoutIcon} alt={LABELS.logout} className="sidebar-icon" />
        {LABELS.logout}
      </Link>
    </div>
  );
};

export default SidebarIcon;
