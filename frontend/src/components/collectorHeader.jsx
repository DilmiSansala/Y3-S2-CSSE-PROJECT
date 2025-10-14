import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../images/leaf.png";
import { CollectorContext } from "../context/collectorContext";
import QrScanner from "qr-scanner"; // Import QR Scanner library
import "./collectorHeader.css";
import qr from "../images/qrcode.gif";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

function CollectorHeader() {
  const { currentUser, logout } = useContext(CollectorContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scanner, setScanner] = useState(null);
  const videoRef = useRef(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    if (isModalOpen && videoRef.current) {
      // Initialize the QR scanner
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('Scanned result:', result.data);
          setIsModalOpen(false);
          qrScanner.stop(); // Stop the scanner after scan
          navigate(`/collector/progress?residentId=${result.data}`);
        },
        {
          highlightScanRegion: true, // Optional: To highlight the scan area
        }
      );
      qrScanner.start(); // Start the camera and scanning
      setScanner(qrScanner);

      return () => {
        qrScanner.stop(); // Stop the scanner when modal is closed or component unmounts
      };
    }
  }, [isModalOpen, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/collector-signin");
  };

  return (
    <header className='p-4 text-green-700 bg-white shadow-md'>
      <div className='container flex items-center justify-between mx-auto'>
        {/* Logo/Branding */}
        <div className='flex items-center'>
          <img src={Logo} alt='App Logo' className='h-10 mr-3' />
          <h1 className='text-2xl font-bold'>Zero Waste Collector</h1>
        </div>

        {/* Navigation Links */}
        <nav className='hidden space-x-6 md:flex'>
          <Link to='/collector/dashboard' className='transition duration-300 hover:text-green-300'>
            Dashboard
          </Link>
          <Link to='/collector/progress' className='transition duration-300 hover:text-green-300'>
            Progress
          </Link>
          <Link to='/collector/schedule' className='transition duration-300 hover:text-green-300'>
            Schedule
          </Link>
          <Link to='/collector/profile' className='transition duration-300 hover:text-green-300'>
            Profile
          </Link>
        </nav>

        {/* User Info, QR Button, and Login/Logout */}
        <div className='flex items-center space-x-4'>
          <div className='relative w-10'>
            <img src={qr} alt='' onClick={() => setIsModalOpen(true)} />
          </div>

          {currentUser ? (
            <>
              <span className='hidden md:inline'>Welcome, {currentUser.name}!</span>
              <button
                onClick={handleLogout}
                className='flex items-center px-4 py-2 text-white transition duration-300 bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
                <FaSignOutAlt className='mr-2' />
                Logout
              </button>
            </>
          ) : (
            <Link
              to='/collector-signin'
              className='flex items-center px-4 py-2 text-white transition duration-300 bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
              <FaSignInAlt className='mr-2' />
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Modal for QR Code Scanner */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-[400px] h-[400px]'>
            <h2 className='mb-4 text-lg font-bold text-center text-black'>Scan QR Code</h2>

            {/* Video element for displaying the camera feed */}
            <video ref={videoRef} className="w-full h-full" />

            <button
              onClick={() => {
                setIsModalOpen(false);
                if (scanner) {
                  scanner.stop();
                }
              }}
              className='px-4 py-2 mt-4 text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none'>
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default CollectorHeader;
