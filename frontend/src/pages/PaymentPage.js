import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import SidebarIcon from '../components/sidebar/SidebarIcon';
import Header from '../components/header/Header';
import Footer from '../components/Footer.js';
import { FaCreditCard, FaCalendarAlt, FaLock } from 'react-icons/fa';
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
  Default: 30,
};

function PaymentPage() {
  const [requests, setRequests] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paying, setPaying] = useState(false);

  const [paymentDetails, setPaymentDetails] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });
  const [errors, setErrors] = useState({});

  // Safer date formatter
  const fmtDate = (d) => {
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return '-';
    }
  };

  // Calculate total amount based on waste type and quantity
  const calculateAmount = (wasteType, quantity) => {
    const pricePerUnit = wastePrices[wasteType] ?? wastePrices.Default;
    const qty = Number(quantity || 0);
    return pricePerUnit * qty;
  };

  // Fetch pending waste requests from the backend
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setLoadErr('');
      try {
        const response = await axios.get('http://localhost:3050/api/auth/waste/history', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = Array.isArray(response.data) ? response.data : [];
        // only pending → normalize minimal fields
        const pending = data
          .filter((r) => r && r.status === 'pending')
          .map((r) => ({
            _id: r._id,
            collectionDate: r.collectionDate || r.date || r.createdAt,
            wasteType: r.wasteType || r.type || 'Unknown',
            quantity: Number(r.quantity ?? r.qty ?? 0),
          }));
        setRequests(pending);
      } catch (error) {
        console.error('Error fetching waste requests:', error);
        setLoadErr('Failed to load pending requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Filter + sort view like your history table
  const view = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = requests;
    if (term) list = list.filter((r) => (r.wasteType || '').toLowerCase().includes(term));
    return [...list].sort((a, b) => new Date(b.collectionDate) - new Date(a.collectionDate));
  }, [requests, q]);

  // Handle selection of a waste request for payment
  const handleRequestSelect = (request) => {
    const amount = calculateAmount(request.wasteType, request.quantity);
    setSelectedRequest({ ...request, amount });
    setShowPaymentForm(true);
    setErrors({});
  };

  const handleInputChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  // Stronger client validation, with clear messages
  const validateForm = () => {
    const newErrors = {};
    const numberOnly = /^\d+$/;

    if (!paymentDetails.cardHolderName?.trim()) {
      newErrors.cardHolderName = 'Cardholder name is required';
    }
    if (!paymentDetails.cardNumber || !numberOnly.test(paymentDetails.cardNumber) || paymentDetails.cardNumber.length !== 12) {
      newErrors.cardNumber = 'Card number must be 12 digits (numbers only)';
    }
    // MM/YY basic check (01-12 for month)
    const expiryOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentDetails.expiryDate);
    if (!expiryOk) {
      newErrors.expiryDate = 'Expiry must be in MM/YY format';
    }
    if (!paymentDetails.cvc || !numberOnly.test(paymentDetails.cvc) || paymentDetails.cvc.length !== 3) {
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
      setPaying(true);
      const res = await axios.post('http://localhost:3050/api/payment/process', {
        residentId: localStorage.getItem('residentId'), // if you have it saved after login
        amount: selectedRequest.amount,
        wasteRequestIds: [selectedRequest._id],
        ...paymentDetails,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      alert(res.data?.message || 'Payment successful.');
      // remove the paid request from table
      setRequests((prev) => prev.filter((r) => r._id !== selectedRequest._id));
      // reset form state
      setShowPaymentForm(false);
      setSelectedRequest(null);
      setPaymentDetails({ cardHolderName: '', cardNumber: '', expiryDate: '', cvc: '' });
    } catch (error) {
      console.error('Payment error:', error?.response?.data || error.message);
      alert('Failed to process payment. ' + (error?.response?.data?.message || 'Please try again.'));
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="payment-page-container">
      <SidebarIcon />
      <div className="main-content-payment">
        <Header />
        <div className="payment-content">

          <h2 style={{ marginBottom: 10 }}>Pending Waste Collection Requests</h2>

          {/* Search like your history page */}
          <input
            type="text"
            placeholder="Search by waste type..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #cfd8dc',
              borderRadius: 8,
              marginBottom: 12,
              outline: 'none',
            }}
          />

          {/* Table */}
          <div
            style={{
              overflowX: 'auto',
              border: '1px solid #e0e0e0',
              borderRadius: 10,
              boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
            }}
          >
            <table className="payment-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: '#0f4d27', color: '#fff' }}>
                  <th style={th('left')}>DATE</th>
                  <th style={th('left')}>TYPE OF WASTE</th>
                  <th style={th('center')}>QUANTITY (kg)</th>
                  <th style={th('right')}>AMOUNT ($)</th>
                  <th style={th('center')}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ padding: 16, textAlign: 'center' }}>Loading…</td></tr>
                ) : loadErr ? (
                  <tr><td colSpan="5" style={{ padding: 16, textAlign: 'center', color: '#b00020' }}>{loadErr}</td></tr>
                ) : view.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: 16, textAlign: 'center', color: '#607d8b' }}>No pending requests</td></tr>
                ) : (
                  view.map((request, idx) => {
                    const amount = calculateAmount(request.wasteType, request.quantity);
                    return (
                      <tr key={request._id} style={{ background: idx % 2 ? '#f8fbf8' : '#ffffff' }}>
                        <td style={td('left')}>{fmtDate(request.collectionDate)}</td>
                        <td style={td('left')}>{request.wasteType}</td>
                        <td style={td('center')}>{request.quantity}</td>
                        <td style={td('right')}>{amount}</td>
                        <td style={td('center')}>
                          <button
                            className="pay-button"
                            onClick={() => handleRequestSelect(request)}
                            style={{
                              background: '#4caf50',
                              color: '#fff',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: 8,
                              cursor: 'pointer',
                              minWidth: 88,
                              boxShadow: '0 1px 1px rgba(0,0,0,0.08)',
                            }}
                          >
                            Pay ${amount}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Payment form */}
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
                <span className="card-input-icon"><FaCreditCard /></span>
                <input
                  type="text"
                  className="card-input"
                  name="cardNumber"
                  value={paymentDetails.cardNumber}
                  onChange={handleInputChange}
                  maxLength="12"
                  inputMode="numeric"
                  required
                />
                {errors.cardNumber && <p className="error">{errors.cardNumber}</p>}
              </div>

              <div className="expiry-cvc-container">
                <div className="form-group card-input-container">
                  <label>Expiry Date</label>
                  <span className="card-input-icon"><FaCalendarAlt /></span>
                  <input
                    type="text"
                    className="card-input"
                    name="expiryDate"
                    value={paymentDetails.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    required
                  />
                  {errors.expiryDate && <p className="error">{errors.expiryDate}</p>}
                </div>

                <div className="form-group card-input-container">
                  <label>CVC</label>
                  <span className="card-input-icon"><FaLock /></span>
                  <input
                    type="text"
                    className="card-input"
                    name="cvc"
                    value={paymentDetails.cvc}
                    onChange={handleInputChange}
                    maxLength="3"
                    inputMode="numeric"
                    required
                  />
                  {errors.cvc && <p className="error">{errors.cvc}</p>}
                </div>
              </div>

              <button
                type="submit"
                className="submit-payment"
                disabled={paying}
                style={{ opacity: paying ? 0.7 : 1 }}
              >
                {paying ? 'Processing…' : 'Submit Payment'}
              </button>
            </form>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}

// tiny inline styles so we don’t depend on external CSS being present
function th(align) {
  return {
    position: 'sticky',
    top: 0,
    padding: '12px 14px',
    fontWeight: 700,
    letterSpacing: 0.6,
    textAlign: align,
    borderBottom: '1px solid #0d3f20',
  };
}
function td(align) {
  return {
    padding: '12px 14px',
    borderBottom: '1px solid #e8f0ea',
    color: '#263238',
    textAlign: align,
    whiteSpace: 'nowrap',
  };
}

export default PaymentPage;
