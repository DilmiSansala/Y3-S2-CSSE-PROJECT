import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash, FaUser, FaMapMarkerAlt, FaCity, FaPhoneAlt, FaEnvelope } from "react-icons/fa"; // Import necessary icons

const CollectorProfile = () => {
  const [collector, setCollector] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch collector profile data
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios
      .get("http://localhost:3050/api/collector/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCollector(response.data);
      })
      .catch((error) => {
        console.error("Error fetching collector data:", error);
        setMessage(error.response?.data?.message || "Error fetching data");
        setMessageType("error");
      });
  }, []);

  // Update profile
  const handleUpdate = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (collector.newPassword && collector.newPassword !== collector.confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    axios
      .put("http://localhost:3050/api/collector/profile", collector, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setMessage("Profile updated successfully!");
        setMessageType("success");
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        setMessage("Error updating profile.");
        setMessageType("error");
      });
  };

  // Toggle password visibility
  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className='container max-w-lg p-4 mx-auto my-10 bg-white shadow-2xl rounded-2xl'>
      <h1 className='mb-6 text-3xl font-bold text-center text-green-700'>Collector Profile</h1>

      {message && (
        <div
          className={`px-4 py-3 rounded relative mb-4 ${
            messageType === "success" ? "bg-green-100 text-green-700 border border-green-400" : "bg-red-100 text-red-700 border border-red-400"
          }`}>
          <span className='block sm:inline'>{message}</span>
        </div>
      )}

      {!isEditing ? (
        <>
          <div className='grid grid-cols-2 gap-8 mx-6 mb-6'>
            <div className='flex items-center'>
              <FaUser className='mr-2 text-gray-700' />
              <strong>Full Name :</strong>
            </div>
            <div>{collector.name}</div>

            <div className='flex items-center'>
              <FaMapMarkerAlt className='mr-2 text-gray-700' />
              <strong>Address :</strong>
            </div>
            <div>{collector.address}</div>

            <div className='flex items-center'>
              <FaCity className='mr-2 text-gray-700' />
              <strong>City :</strong>
            </div>
            <div>{collector.city}</div>

            <div className='flex items-center'>
              <FaPhoneAlt className='mr-2 text-gray-700' />
              <strong>Phone :</strong>
            </div>
            <div>{collector.phone}</div>

            <div className='flex items-center'>
              <FaEnvelope className='mr-2 text-gray-700' />
              <strong>Email :</strong>
            </div>
            <div>{collector.email}</div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className='flex w-40 px-10 py-2 mx-auto mb-4 text-white bg-green-500 rounded-full hover:bg-green-600'>
            Edit Profile
          </button>
        </>
      ) : (
        <form onSubmit={handleUpdate} className='grid grid-cols-2 gap-6 px-6 pb-6'>
          <label className='block text-gray-700'>Full Name</label>
          <input
            type='text'
            name='name'
            value={collector.name}
            onChange={(e) => setCollector({ ...collector, name: e.target.value })}
            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
          />

          <label className='block text-gray-700'>Address</label>
          <input
            type='text'
            name='address'
            value={collector.address}
            onChange={(e) => setCollector({ ...collector, address: e.target.value })}
            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
          />

          <label className='block text-gray-700'>City</label>
          <input
            type='text'
            name='city'
            value={collector.city}
            onChange={(e) => setCollector({ ...collector, city: e.target.value })}
            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
          />

          <label className='block text-gray-700'>Phone</label>
          <input
            type='text'
            name='phone'
            value={collector.phone}
            onChange={(e) => setCollector({ ...collector, phone: e.target.value })}
            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
          />

          <label className='block text-gray-700'>Email</label>
          <input
            type='email'
            name='email'
            value={collector.email}
            onChange={(e) => setCollector({ ...collector, email: e.target.value })}
            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
          />

          <label className='block text-gray-700'>New Password</label>
          <div className='relative'>
            <input
              type={showNewPassword ? "text" : "password"}
              name='newPassword'
              value={collector.newPassword}
              onChange={(e) => setCollector({ ...collector, newPassword: e.target.value })}
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
              placeholder='Enter new password (leave blank to keep current password)'
            />
            <span onClick={toggleShowNewPassword} className='absolute inset-y-0 text-gray-500 cursor-pointer right-4 top-2'>
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <label className='block text-gray-700'>Confirm Password</label>
          <div className='relative'>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name='confirmPassword'
              value={collector.confirmPassword}
              onChange={(e) => setCollector({ ...collector, confirmPassword: e.target.value })}
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
              placeholder='Confirm new password'
            />
            <span onClick={toggleShowConfirmPassword} className='absolute inset-y-0 text-gray-500 cursor-pointer right-4 top-2'>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className='col-span-2'>
            <button type='submit' className='w-full px-4 py-2 mt-4 text-white bg-green-500 rounded-full hover:bg-green-600'>
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CollectorProfile;
