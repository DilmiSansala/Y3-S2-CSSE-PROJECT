import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarIcon from '../components/sidebar/SidebarIcon';
import Header from '../components/header/Header';
import Footer from '../components/Footer.js';
import { FaCreditCard, FaCalendarAlt, FaLock } from 'react-icons/fa'; // Import the icons
import './PaymentPage.css';

// Pricing structure based on waste type
const wastePrices = {
  Glass: 15,
  Wood: 10,
  Hazardous: 60,
  Paper: 10,
  Metal: 20,
  Plastic: 30,
  Organic: 30,
  Electronics: 50,
};

function PaymentPage() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });
  const [errors, setErrors] = useState({});

  // Fetch pending waste requests from the backend
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3050/api/auth/waste/history', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const pendingRequests = response.data.filter(request => request.status === 'pending');
        setRequests(pendingRequests);
      } catch (error) {
        console.error('Error fetching waste requests:', error);
      }
    };

    fetchRequests();
  }, []);

  // Calculate total amount based on waste type and quantity
  const calculateAmount = (wasteType, quantity) => {
    const pricePerUnit = wastePrices[wasteType] || 0;
    return pricePerUnit * quantity;
  };

  // Handle selection of a waste request for payment
  const handleRequestSelect = (request) => {
    const amount = calculateAmount(request.wasteType, request.quantity);
    setSelectedRequest({ ...request, amount });
    setShowPaymentForm(true);
  };

  const handleInputChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!paymentDetails.cardHolderName) {
      newErrors.cardHolderName = 'Cardholder name is required';
    }
    if (!paymentDetails.cardNumber || paymentDetails.cardNumber.length !== 12) {
      newErrors.cardNumber = 'Card number must be 12 digits';
    }
    if (!paymentDetails.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    }
    if (!paymentDetails.cvc || paymentDetails.cvc.length !== 3) {
      newErrors.cvc = 'CVC must be 3 digits';
    }
    return newErrors;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3050/api/payment/process', {
        residentId: localStorage.getItem('residentId'), // Replace with actual resident ID
        amount: selectedRequest.amount,
        wasteRequestIds: [selectedRequest._id],
        ...paymentDetails,
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Payment error:', error.response?.data || error.message); // Log the error details
      alert('Failed to process payment. ' + (error.response?.data.message || 'Please try again.'));
    }
  };

  return (
    <div className="payment-page-container">
      <SidebarIcon />
      <div className="main-content-payment">
        <Header />
        <div className="payment-content">
          <h2>Pending Waste Collection Requests</h2>
          <table className="payment-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type of Waste</th>
                <th>Quantity (kg)</th>
                <th>Amount ($)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map(request => (
                  <tr key={request._id}>
                    <td>{new Date(request.collectionDate).toLocaleDateString()}</td>
                    <td>{request.wasteType}</td>
                    <td>{request.quantity}</td>
                    <td>{calculateAmount(request.wasteType, request.quantity)}</td>
                    <td>
                      <button
                        className="pay-button"
                        onClick={() => handleRequestSelect(request)}
                      >
                        Pay ${calculateAmount(request.wasteType, request.quantity)}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No pending requests</td>
                </tr>
              )}
            </tbody>
          </table>

          {showPaymentForm && selectedRequest && (
            <form className="payment-form" onSubmit={handlePaymentSubmit}>
            <h3 className="form-header">Enter Payment Details</h3>
            <div className="form-group">
              <label>Cardholder Name</label>
              <input
                type="text"
                name="cardHolderName"
                value={paymentDetails.cardHolderName}
                onChange={handleInputChange}
                required
              />
              {errors.cardHolderName && <p className="error">{errors.cardHolderName}</p>}
            </div>
            <div className="form-group card-input-container">
              <label>Card Number</label>
              <span className="card-input-icon">
                <FaCreditCard />
              </span>
              <input
                type="text"
                className="card-input"
                name="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={handleInputChange}
                maxLength="12"
                required
              />
              {errors.cardNumber && <p className="error">{errors.cardNumber}</p>}
            </div>
            <div className="expiry-cvc-container">
              <div className="form-group card-input-container">
                <label>Expiry Date</label>
                <span className="card-input-icon">
                  <FaCalendarAlt />
                </span>
                <input
                  type="text"
                  className="card-input"
                  name="expiryDate"
                  value={paymentDetails.expiryDate}
                  onChange={handleInputChange}
                  required
                  placeholder="MM/YY"
                />
                {errors.expiryDate && <p className="error">{errors.expiryDate}</p>}
              </div>
              <div className="form-group card-input-container">
                <label>CVC</label>
                <span className="card-input-icon">
                  <FaLock />
                </span>
                <input
                  type="text"
                  className="card-input"
                  name="cvc"
                  value={paymentDetails.cvc}
                  onChange={handleInputChange}
                  maxLength="3"
                  required
                />
                {errors.cvc && <p className="error">{errors.cvc}</p>}
              </div>
            </div>
            <button type="submit" className="submit-payment">
              Submit Payment
            </button>
          </form>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default PaymentPage;
