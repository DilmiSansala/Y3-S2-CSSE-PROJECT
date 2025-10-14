import React, { useState, useEffect, useRef } from "react";
import SidebarIcon from "../components/sidebar/SidebarIcon";
import Header from "../components/header/Header";
import Footer from "../components/Footer";
import { QRCodeCanvas } from "qrcode.react";
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
import styles from "./ResidentProfileForm.module.css";
import withAuth from "../hoc/withAuth";
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaCity, FaPhone, FaLock, FaDownload, FaClipboard } from "react-icons/fa";

const ResidentProfile = () => {
  const [form, setForm] = useState({
    residentName: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [residentId, setResidentId] = useState(""); // Store resident ID
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const qrCodeRef = useRef(null); // Ref to access the QR code for downloading

  useEffect(() => {
    const fetchResidentData = async () => {
      try {
        const response = await fetch("http://localhost:3050/api/auth/resident/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setForm({
            residentName: data.residentName,
            address: data.address,
            city: data.city,
            phone: data.phone,
            email: data.email,
            password: "",
            confirmPassword: "",
          });
          setResidentId(data._id); // Set resident ID for QR code
        } else {
          setError("Failed to fetch resident data.");
        }
      } catch (err) {
        console.error("Error fetching resident data:", err);
        setError("An error occurred while fetching resident data.");
      }
    };

    fetchResidentData();
  }, []);

  const onUpdateField = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3050/api/auth/resident/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...form,
          password: form.password ? form.password : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Profile updated successfully!");
        setError("");
      } else {
        setError(data.message || "Profile update failed. Please try again.");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError("An error occurred while updating the profile.");
    }
  };

  // Function to download QR code as PNG
  const downloadQRCodeAsPNG = () => {
    const qrCodeCanvas = qrCodeRef.current.querySelector("canvas");
    const pngUrl = qrCodeCanvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `Resident-QR-${residentId}.png`;
    downloadLink.click();
  };

  // Function to download QR code as PDF
  const downloadQRCodeAsPDF = () => {
    const qrCodeCanvas = qrCodeRef.current.querySelector("canvas");
    const pdf = new jsPDF();
    const pngUrl = qrCodeCanvas.toDataURL("image/png");
    pdf.addImage(pngUrl, "PNG", 20, 30, 150, 150);
    pdf.save(`Resident-QR-${residentId}.pdf`);
  };

  // Function to copy QR code to clipboard
  const copyQRCodeToClipboard = () => {
    const qrCodeCanvas = qrCodeRef.current.querySelector("canvas");
    qrCodeCanvas.toBlob((blob) => {
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard.write([item]);
      alert("QR code copied to clipboard!");
    });
  };

  return (
    <div className={styles.container}>
      <SidebarIcon />
      <div className='main-content'>
        <Header />
        <div className={styles.formContainer}>
          <form className={styles.form} onSubmit={onSubmit}>
            <h2 className={styles.heading}>Edit Resident Profile</h2>

            <div className={styles.formRow}>
              <label className={styles.formLabel}>
                <FaUser className={styles.icon} /> Full Name
              </label>
              <input
                className={styles.formField}
                type='text'
                name='residentName'
                value={form.residentName}
                onChange={onUpdateField}
                placeholder='Enter your full name'
                required
              />
            </div>

            <div className={styles.formRow}>
              <label className={styles.formLabel}>
                <FaMapMarkerAlt className={styles.icon} /> Address
              </label>
              <input
                className={styles.formField}
                type='text'
                name='address'
                value={form.address}
                onChange={onUpdateField}
                placeholder='Enter your address'
                required
              />
            </div>

            <div className={styles.formRow}>
              <label className={styles.formLabel}>
                <FaCity className={styles.icon} /> City
              </label>
              <input
                className={styles.formField}
                type='text'
                name='city'
                value={form.city}
                onChange={onUpdateField}
                placeholder='Enter your city'
                required
              />
            </div>

            <div className={styles.formRow}>
              <label className={styles.formLabel}>
                <FaPhone className={styles.icon} /> Phone
              </label>
              <input
                className={styles.formField}
                type='tel'
                name='phone'
                value={form.phone}
                onChange={onUpdateField}
                placeholder='Enter your phone number'
                pattern='\d{10}'
                maxLength='10'
                required
              />
            </div>

            <div className={styles.formRow}>
              <label className={styles.formLabel}>
                <FaEnvelope className={styles.icon} /> Email
              </label>
              <input className={styles.formField} type='email' name='email' value={form.email} disabled />
            </div>

            <div className={styles.formRow}>
              <label className={styles.formLabel}>
                <FaLock className={styles.icon} /> New Password
              </label>
              <input
                className={styles.formField}
                type='password'
                name='password'
                value={form.password}
                onChange={onUpdateField}
                placeholder='Enter new password (leave blank to keep current password)'
              />
            </div>

            <div className={styles.formRow}>
              <label className={styles.formLabel}>
                <FaLock className={styles.icon} /> Confirm Password
              </label>
              <input
                className={styles.formField}
                type='password'
                name='confirmPassword'
                value={form.confirmPassword}
                onChange={onUpdateField}
                placeholder='Confirm new password'
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}

            <div className={styles.formActions}>
              <button type='submit' className={styles.formSubmitBtn}>
                Update Profile
              </button>
            </div>
          </form>

          {/* Display QR Code */}
          {residentId && (
            <div className='p-6 mt-8 bg-white rounded-lg shadow-lg'>
              <h3 className='flex justify-center mx-auto mb-4 text-2xl font-semibold text-gray-800'>Your QR Code</h3>

              <div className='flex mx-auto justify-center p-2 mb-6 border-8 border-black w-[190px]' ref={qrCodeRef}>
                <QRCodeCanvas className='' value={residentId} size={150} />
              </div>

              {/* Buttons for actions */}
              <div className='flex justify-center mb-6 space-x-4'>
                <button
                  onClick={downloadQRCodeAsPNG}
                  className='flex items-center px-4 py-2 text-white transition duration-200 bg-green-500 rounded-lg hover:bg-green-600'>
                  <FaDownload className='mr-2' /> Download as PNG
                </button>

                <button
                  onClick={downloadQRCodeAsPDF}
                  className='flex items-center px-4 py-2 text-white transition duration-200 bg-blue-500 rounded-lg hover:bg-blue-600'>
                  <FaDownload className='mr-2' /> Download as PDF
                </button>

                <button
                  onClick={copyQRCodeToClipboard}
                  className='flex items-center px-4 py-2 text-white transition duration-200 bg-yellow-500 rounded-lg hover:bg-yellow-600'>
                  <FaClipboard className='mr-2' /> Copy to Clipboard
                </button>
              </div>

              {/* Simple instructions */}
              <div className='p-4 text-center text-gray-700 bg-gray-100 rounded-lg'>
                <p className='font-semibold'>
                  <strong>Instructions:</strong>
                </p>
                <p className='mt-2'>
                  Download the QR code and print it. Place it near your wastebin or a visible area outside your residence. Waste collectors can scan
                  it to access your waste collection requests.
                </p>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default withAuth(ResidentProfile);
