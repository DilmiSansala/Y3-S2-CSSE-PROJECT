import React, { useState, useEffect } from "react";
import axios from "axios";
import SidebarIcon from "../components/sidebar/SidebarIcon";
import Header from "../components/header/Header";
import Footer from "../components/Footer.js";
import "../components/sidebar/styles.css";
import "./wasteRequest.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Bin from "../images/types.png";
import withAuth from '../hoc/withAuth';

function WasteRequest({ onRequestCreated }) {
  const [form, setForm] = useState({
    wasteType: "",
    quantity: 1, // Default quantity set to 1
    collectionDate: null,
    collectionTime: "",
    collectionCenter: "" // Add collection center field
  });
  const [collectionCenters, setCollectionCenters] = useState([]); // State for collection centers
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const wasteTypes = [
    "Plastic",
    "Organic",
    "Metal",
    "Paper",
    "Glass",
    "Wood",
    "Electronics",
    "Hazardous"
  ];

  // Fetch collection centers from the backend
  useEffect(() => {
    const fetchCollectionCenters = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from local storage
        const response = await axios.get('http://localhost:3050/api/auth/collection-centers', {
          headers: {
            Authorization: `Bearer ${token}` // Set the Authorization header with the Bearer token
          }
        });
        setCollectionCenters(response.data); // Set collection centers
      } catch (err) {
        console.error("Error fetching collection centers", err);
      }
    };
  
    fetchCollectionCenters();
  }, []);
  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post(
        "http://localhost:3050/api/auth/waste/request",
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccessMessage("Waste request created successfully!");

      // Reset the form fields
      setForm({
        wasteType: "",
        quantity: 1,
        collectionDate: null,
        collectionTime: "",
        collectionCenter: "" // Reset collection center
      });

      // Call the function to update the waste history data
      if (onRequestCreated) {
        onRequestCreated();
      }
    } catch (err) {
      console.error('Error creating waste request:', err);
      setError("Error creating waste request. Please try again.");
    }
  };

  const handleFieldChange = (field, value) => {
    setForm((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleQuantityChange = (increment) => {
    setForm((prevState) => ({
      ...prevState,
      quantity: Math.max(1, prevState.quantity + increment),
    }));
  };

  return (
    <div className="waste-request-container">
      <SidebarIcon />
      <div className="main-content-request">
      <div className="large-container">
        <Header />
        <div className="banner-section">
          <h1>Eco-Friendly Waste Management</h1>
          <p>Make a difference by managing your waste responsibly and contributing to a cleaner environment.</p>
        </div>
        <div className="content-wrapper">
          <div className="form-container">
            <h2>Request Waste Collection</h2>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <form onSubmit={handleFormSubmit} className="waste-request-form">
              <div className="form-group">
                <label htmlFor="wasteType">Type of Waste</label>
                <select
                  id="wasteType"
                  value={form.wasteType}
                  onChange={(e) => handleFieldChange("wasteType", e.target.value)}
                  required
                >
                  <option value="" disabled>Select waste type</option>
                  {wasteTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity (kg)</label>
                <div className="quantity-container">
                  <button
                    type="button"
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={form.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    value={form.quantity}
                    onChange={(e) => handleFieldChange("quantity", parseInt(e.target.value))}
                    min="1"
                    required
                  />
                  <button
                    type="button"
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="collectionDate">Preferred Collection Date</label>
                <DatePicker
                  selected={form.collectionDate}
                  onChange={(date) => handleFieldChange("collectionDate", date)}
                  dateFormat="MMMM d, yyyy"
                  className="date-picker-input"
                  placeholderText="Select a date"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="collectionTime">Preferred Collection Time</label>
                <input
                  type="time"
                  id="collectionTime"
                  value={form.collectionTime}
                  onChange={(e) => handleFieldChange("collectionTime", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="collectionCenter">Select Collection Center</label>
                <select
                  id="collectionCenter"
                  value={form.collectionCenter}
                  onChange={(e) => handleFieldChange("collectionCenter", e.target.value)}
                  required
                >
                  <option value="" disabled>Select collection center</option>
                  {collectionCenters.map((center) => (
                    <option key={center._id} value={center._id}>
                      {center.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <button type="submit" className="submit-button">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
          <div className="image-container">
            <img src={Bin} alt="Waste Management" className="waste-image" />
          </div>
        </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default withAuth(WasteRequest);
