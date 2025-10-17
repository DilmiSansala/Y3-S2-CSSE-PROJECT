import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import SidebarIcon from '../components/sidebar/SidebarIcon';
import Header from '../components/header/Header';
import Footer from '../components/Footer.js';
// import { FaCreditCard, FaCalendarAlt, FaLock } from 'react-icons/fa'; // Import the icons
import './PaymentPage.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'qrcode';
import Logo from '../images/leaf.png';

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
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [lastConfirm, setLastConfirm] = useState(null);
  const [showConfirmDebug, setShowConfirmDebug] = useState(false);
  // Removed payment form state and logic (now in PaymentFormPage)

  // Fetch waste requests from the backend
  // make fetchRequests available to manual refresh
  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:3050/api/auth/waste/history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Show all requests so UI reflects status updates (e.g., 'payment complete')
      setRequests(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching waste requests:', error);
      setRequests([]);
    }
  };

  useEffect(() => {
    fetchRequests();
    // Polling: refresh requests every 30s
    const interval = setInterval(() => {
      fetchRequests();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // On return from Stripe success, confirm session and update backend
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const sessionId = params.get('session_id');
    if (status === 'success' && sessionId) {
      // Try confirming the session repeatedly with exponential backoff to allow webhook propagation
      const tryConfirm = async (attempt = 1, maxAttempts = 5) => {
        try {
          const res = await axios.get(`http://localhost:3050/api/payment/confirm`, { params: { sessionId }});
          console.log('confirm response', res.data);
          setLastConfirm(res.data);
          // Generate receipt PDF with logo and Zero Waste header
          const session = res.data.session;

          const fetchImageDataUrl = async (url) => {
            try {
              const resp = await fetch(url);
              const blob = await resp.blob();
              return await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
            } catch (err) {
              console.error('Failed to fetch image for receipt', err);
              return null;
            }
          };

          const generateReceipt = async (sessionObj) => {
            const doc = new jsPDF({ unit: 'pt', format: 'a4' });

            // Try to add logo (falls back to no logo)
            const logoDataUrl = await fetchImageDataUrl(Logo).catch(() => null);
            if (logoDataUrl) {
              try {
                doc.addImage(logoDataUrl, 'PNG', 40, 30, 80, 45);
              } catch (err) {
                console.error('addImage failed', err);
              }
            }

            // Zero Waste header
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text('Zero Waste', 140, 55);

            // Title
            doc.setFontSize(14);
            doc.setFont('helvetica', 'normal');
            doc.text('Payment Receipt', 40, 100);

            // Meta
            doc.setFontSize(11);
            const invoiceId = sessionObj.id || sessionId;
            doc.text(`Receipt #: ${invoiceId}`, 40, 120);
            doc.text(`Date: ${new Date().toLocaleString()}`, 40, 135);
            doc.text(`Payment Status: ${sessionObj.payment_status || 'Paid'}`, 40, 150);

            if (sessionObj.metadata && sessionObj.metadata.residentId) {
              doc.text(`Resident ID: ${sessionObj.metadata.residentId}`, 350, 120);
            }
            const wrId = sessionObj.metadata?.wasteRequestId || 'N/A';
            doc.text(`Waste Request ID: ${wrId}`, 350, 135);

            // Itemized table
            // Find wasteRequest details from loaded requests if possible
            const wr = requests.find(r => r._id === sessionObj.metadata?.wasteRequestId) || null;
            const unitPrice = wr ? (wastePrices[wr.wasteType] || 0) : ((sessionObj.amount_total || 0) / 100);
            const qty = wr ? (wr.quantity || 1) : 1;
            const rows = [
              { desc: `Collection - ${wr ? wr.wasteType : 'Waste'}`, qty: String(qty), unit: `$${unitPrice.toFixed(2)}`, total: `$${(unitPrice * qty).toFixed(2)}` }
            ];

            // Try dynamic import of jspdf-autotable plugin; if unavailable, render simple table
            let usedAutoTable = false;
            try {
              // plugin attaches autoTable to jsPDF prototype when imported
              await import('jspdf-autotable');
              if (doc.autoTable) {
                doc.autoTable({
                  head: [['Description', 'Qty', 'Unit', 'Total']],
                  body: rows.map(r => [r.desc, r.qty, r.unit, r.total]),
                  startY: 170,
                  theme: 'grid',
                  headStyles: { fillColor: [230, 230, 230], textColor: 20 },
                  styles: { fontSize: 10 }
                });
                usedAutoTable = true;
              }
            } catch (err) {
              // plugin not available; fallback to simple text rows
              console.warn('jspdf-autotable not available, falling back to plain table rendering');
            }

            if (!usedAutoTable) {
              // Draw simple table headings
              const startY = 170;
              doc.setFontSize(10);
              doc.text('Description', 40, startY);
              doc.text('Qty', 300, startY);
              doc.text('Unit', 350, startY);
              doc.text('Total', 450, startY);
              // single row
              doc.text(rows[0].desc, 40, startY + 18);
              doc.text(rows[0].qty, 300, startY + 18);
              doc.text(rows[0].unit, 350, startY + 18);
              doc.text(rows[0].total, 450, startY + 18);
            }

            const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 210;
            const amountPaid = sessionObj.amount_total ? (sessionObj.amount_total / 100) : (unitPrice * qty);
            doc.setFontSize(11);
            doc.text(`Subtotal: $${(unitPrice * qty).toFixed(2)}`, 350, finalY + 10);
            doc.text(`Total Paid: $${amountPaid.toFixed(2)}`, 350, finalY + 30);

            // Add QR code with verification URL
            const verifyUrl = `${window.location.origin}/verify-payment?session=${sessionObj.id}`;
            try {
              const qrcodeModule = await import('qrcode');
              if (qrcodeModule && qrcodeModule.toDataURL) {
                const qrDataUrl = await qrcodeModule.toDataURL(verifyUrl, { margin: 1, width: 120 });
                doc.addImage(qrDataUrl, 'PNG', 40, finalY + 10, 100, 100);
              } else {
                console.warn('qrcode module does not expose toDataURL');
              }
            } catch (err) {
              console.warn('qrcode package not available, skipping QR code');
            }

            // Footer / signature
            const footerY = finalY + 140;
            doc.setFontSize(10);
            doc.text('Thank you for using Zero Waste collection services', 40, footerY);
            doc.setLineWidth(0.5);
            doc.line(350, footerY - 10, 520, footerY - 10);
            doc.text('Collector signature', 360, footerY + 5);

            // Save file
            try {
              doc.save(`payment_receipt_${invoiceId}.pdf`);
            } catch (err) {
              console.error('Failed to save PDF', err);
            }
          };

          generateReceipt(session).catch(err => console.error('Receipt generation error', err));

          // Optimistically update local UI so status shows as Paid immediately and refresh from server
          const wasteRequestId = session?.metadata?.wasteRequestId;
          if (wasteRequestId) {
            setRequests((prev) => prev.map(r => r._id === wasteRequestId ? { ...r, status: 'payment complete' } : r));
          }

          // Also re-fetch latest requests from server to ensure UI matches DB
          fetchRequests();

          // Clean URL query params without reloading
          const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        } catch (err) {
          console.warn(`Confirm attempt ${attempt} failed; will retry if attempts remain`);
          if (attempt < maxAttempts) {
            const delay = 2000 * Math.pow(2, attempt - 1); // 2s,4s,8s...
            setTimeout(() => tryConfirm(attempt + 1, maxAttempts), delay);
          } else {
            // Give up after maxAttempts; UI polling will pick up status shortly or user can refresh
            console.error('All confirm attempts failed. Please refresh later or check payments.');
          }
        }
      };

      tryConfirm();
    }
  }, []);

  // Calculate total amount based on waste type and quantity
  const calculateAmount = (wasteType, quantity) => {
    const pricePerUnit = wastePrices[wasteType] || 0;
    return pricePerUnit * Number(quantity || 0);
  };

  // Handle selection of a waste request for payment
  const handleRequestSelect = async (request) => {
    // Immediately trigger Stripe checkout
    try {
      const residentId = localStorage.getItem('residentId');
      const { data } = await axios.post('http://localhost:3050/api/payment/create-checkout-session', {
        residentId,
        wasteRequestId: request._id,
      });

      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
      if (!stripe) {
        alert('Stripe failed to initialize.');
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (error) {
      console.error('Payment error:', error.response?.data || error.message);
      alert('Failed to start checkout. Please try again.');
    }
  };

  return (
    <div className="payment-page-container">
      <SidebarIcon />
      <div className="main-content-payment">
        <Header />
        <div className="payment-content">
          <div className="flex items-center justify-between">
            <h2>Waste Collection Requests</h2>
            <div>
              <button onClick={fetchRequests} className="px-3 py-1 mr-2 bg-blue-500 text-white rounded">Refresh</button>
              <button onClick={() => setShowConfirmDebug(prev => !prev)} className="px-3 py-1 bg-gray-200 rounded">Debug</button>
            </div>
          </div>

          {/* ===================== NEW TABLE (only this part changed) ===================== */}
          <table
            className="payment-table"
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
              border: "1px solid #e0e0e0",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ background: "#0f4d27", color: "#fff" }}>
                <th style={{ padding: "12px 14px", textAlign: "left", position: "sticky", top: 0 }}>DATE</th>
                <th style={{ padding: "12px 14px", textAlign: "left", position: "sticky", top: 0 }}>TYPE OF WASTE</th>
                <th style={{ padding: "12px 14px", textAlign: "center", position: "sticky", top: 0 }}>QUANTITY (kg)</th>
                <th style={{ padding: "12px 14px", textAlign: "right", position: "sticky", top: 0 }}>AMOUNT ($)</th>
                <th style={{ padding: "12px 14px", textAlign: "left", position: "sticky", top: 0 }}>PAYMENT STATUS</th>
                <th style={{ padding: "12px 14px", textAlign: "center", position: "sticky", top: 0 }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(requests) && requests.length > 0 ? (
                requests
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b?.collectionDate || 0).getTime() -
                      new Date(a?.collectionDate || 0).getTime()
                  )
                  .map((request, idx) => {
                    const amt = calculateAmount(request?.wasteType, request?.quantity);
                    const isPaid = request?.status === 'payment complete';

                    return (
                      <tr key={request?._id || idx} style={{ background: idx % 2 ? "#f8fbf8" : "#ffffff" }}>
                        <td style={{ padding: "12px 14px", borderBottom: "1px solid #e8f0ea", textAlign: "left", whiteSpace: "nowrap" }}>
                          {request?.collectionDate ? new Date(request.collectionDate).toLocaleDateString() : "-"}
                        </td>
                        <td style={{ padding: "12px 14px", borderBottom: "1px solid #e8f0ea", textAlign: "left", whiteSpace: "nowrap" }}>
                          {request?.wasteType || "-"}
                        </td>
                        <td style={{ padding: "12px 14px", borderBottom: "1px solid #e8f0ea", textAlign: "center", whiteSpace: "nowrap" }}>
                          {request?.quantity ?? "-"}
                        </td>
                        <td style={{ padding: "12px 14px", borderBottom: "1px solid #e8f0ea", textAlign: "right", whiteSpace: "nowrap" }}>
                          {amt}
                        </td>
                        <td
                          style={{
                            padding: "12px 14px",
                            borderBottom: "1px solid #e8f0ea",
                            textAlign: "left",
                            whiteSpace: "nowrap",
                            fontWeight: 600,
                            color: isPaid ? "#1b5e20" : "#b36b00",
                          }}
                        >
                          {isPaid ? "Paid" : "Pending"}
                        </td>
                        <td style={{ padding: "12px 14px", borderBottom: "1px solid #e8f0ea", textAlign: "center", whiteSpace: "nowrap" }}>
                          <button
                            className="pay-button"
                            onClick={() => handleRequestSelect(request)}
                            disabled={isPaid}
                            style={{
                              background: isPaid ? "#9e9e9e" : "#4caf50",
                              color: "#fff",
                              border: "none",
                              padding: "8px 16px",
                              borderRadius: 8,
                              cursor: isPaid ? "not-allowed" : "pointer",
                              minWidth: 110,
                            }}
                            title={isPaid ? "Already paid" : undefined}
                          >
                            {isPaid ? "Paid" : `Pay $${amt}`}
                          </button>
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: "14px", textAlign: "center", color: "#607d8b", borderBottom: "1px solid #e8f0ea" }}>
                    No requests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* =================== END NEW TABLE =================== */}

          {showConfirmDebug && lastConfirm && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h3 className="font-bold">Last Confirm Response (debug)</h3>
              <pre className="text-xs overflow-auto">{JSON.stringify(lastConfirm, null, 2)}</pre>
            </div>
          )}

          {/* Payment form moved to PaymentFormPage */}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default PaymentPage;
