import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaExclamationTriangle } from "react-icons/fa"; // Import report icon
import { useLocation } from "react-router-dom";

function CollectorProgress() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("today"); // Default filter is today
  const [message, setMessage] = useState("");
  const [expandedRequests, setExpandedRequests] = useState({}); // State to track which requests are expanded
  const [isReportModalOpen, setIsReportModalOpen] = useState(false); // State to manage report modal visibility
  const [selectedRequestId, setSelectedRequestId] = useState(null); // Track the request ID for reporting
  const [issueDescription, setIssueDescription] = useState(""); // Track the issue description

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const scannedResidentId = queryParams.get("residentId");

  // Fetch collection requests based on filter or residentId
  useEffect(() => {
    if (scannedResidentId) {
      handleAutoCollect(scannedResidentId); // Automatically collect requests for the scanned resident
    }
    fetchRequests(); // Fetch requests based on the current filter
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, scannedResidentId]); // Trigger fetching whenever the filter or scannedResidentId changes

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:3050/api/requests/filter?filter=${filter}`);
      setRequests(response.data);
      console.log("Requests fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching requests:", error.response ? error.response.data : error.message);
    }
  };

  const clearMessageAfterTimeout = () => {
    setTimeout(() => {
      setMessage("");
    }, 2000); // 2 seconds timer
  };

  // Automatically mark requests as collected for the resident ID scanned
  const handleAutoCollect = async (residentId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`http://localhost:3050/api/requests?residentId=${residentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const requestsToCollect = response.data.filter((request) => request.status !== "collected");

      for (const request of requestsToCollect) {
        await axios.put(
          `http://localhost:3050/api/requests/${request._id}/collected`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setMessage(`All requests for resident ID ${residentId} have been marked as collected.`);
      fetchRequests(); // Fetch the updated requests
    } catch (error) {
      console.error("Error marking requests as collected:", error);
      setMessage("Error updating the status of requests.");
    }
  };

  // Handle checkbox toggle (Mark request as collected or not)
  const handleCollectedToggle = (requestId, isCollected) => {
    const endpoint = isCollected ? "collected" : "pending"; // Change endpoint based on collected status
    axios
      .put(`http://localhost:3050/api/requests/${requestId}/${endpoint}`)
      .then(() => {
        setMessage(`Request status updated to ${isCollected ? "collected" : "pending"}!`);
        clearMessageAfterTimeout();
        fetchRequests(); // Refresh the list after status update
      })
      .catch((error) => {
        setMessage("Error updating request status.");
        clearMessageAfterTimeout();
      });
  };

  // Handle request expansion and collapsing
  const toggleExpand = (requestId) => {
    setExpandedRequests((prev) => ({
      ...prev,
      [requestId]: !prev[requestId], // Toggle expansion state for the request
    }));
  };

  // Handle reporting issue (Open the modal to report an issue)
  const handleReportIssue = (requestId) => {
    setSelectedRequestId(requestId); // Store the request ID
    setIsReportModalOpen(true); // Open the report modal
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsReportModalOpen(false);
    setIssueDescription(""); // Clear the issue description
  };

  const handleSubmitReport = (requestId, issueDescription) => {
    if (!requestId || !issueDescription) {
      setMessage("Request ID and issue description are required.");
      return;
    }

    const token = localStorage.getItem("authToken"); // Retrieve the JWT token from localStorage

    if (!token) {
      setMessage("Not authorized. Please log in again.");
      return;
    }

    axios
      .post(
        `http://localhost:3050/api/issues/report`,
        {
          requestId,
          issueDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT token in the request header
          },
        }
      )
      .then((response) => {
        setMessage("Issue reported successfully!");
        clearMessageAfterTimeout();
        setIsReportModalOpen(false); // Close the modal
        setIssueDescription(""); // Clear the issue description
      })
      .catch((error) => {
        console.error("Error reporting issue:", error.response);
        setMessage(error.response?.data?.message || "Error reporting issue.");
        clearMessageAfterTimeout();
      });
  };

  return (
    <div className='container p-6 mx-auto'>
      <h1 className='mb-6 text-3xl font-bold text-center text-green-700'>Collector Progress</h1>

      {/* Message Notification */}
      {message && <div className='px-4 py-2 mb-4 text-green-700 bg-green-100 rounded-lg'>{message}</div>}

      {/* Filter by Days */}
      <div className='mx-32 mb-6'>
        <label className='font-semibold text-gray-700'>Filter by Day:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)} // Only update the filter state here
          className='px-4 py-2 ml-4 text-gray-600 border rounded-lg'>
          <option value='today'>Today</option>
          <option value='week'>This Week</option>
          <option value='upcoming'>Upcoming</option>
          <option value='month'>This Month</option>
        </select>
      </div>

      {/* Collection Requests List */}
      {requests.length > 0 ? (
        <div className='grid grid-cols-1 gap-6 mx-32'>
          {requests.map((request) => (
            <div key={request._id} className='p-4 bg-white rounded-lg shadow-lg' onClick={() => toggleExpand(request._id)}>
              <div className='flex justify-between'>
                <div className='flex flex-col'>
                  <p className='font-bold text-green-700'>Resident: {request.resident?.residentName}</p>
                </div>
                <div className='flex flex-col'>
                  <p className='text-gray-600'>Waste Type: {request.wasteType}</p>
                </div>
                <div className='flex flex-col'>
                  <p className='text-gray-600'>Quantity: {request.quantity}</p>
                </div>

                {/* Checkbox and Report Issue Button */}
                <div className='flex items-center space-x-4'>
                  {request.status === "collected" ? (
                    <>
                      <span className='font-bold text-green-600'>Collected</span>
                      <input type='checkbox' checked={true} disabled className='w-5 h-5' />
                    </>
                  ) : (
                    <>
                      <div className='relative group'>
                        <input
                          type='checkbox'
                          checked={request.status === "collected"}
                          onChange={(e) => handleCollectedToggle(request._id, e.target.checked)}
                          className='w-5 h-5'
                        />
                        <div className='absolute hidden w-32 mb-2 transform -translate-x-1/2 bottom-full left-1/2 group-hover:block'>
                          <div className='px-2 py-1 mx-auto text-xs text-white bg-gray-700 rounded'>Mark as Collected</div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className='relative group'>
                    <button onClick={() => handleReportIssue(request._id)} className='text-red-400 hover:text-red-800'>
                      <FaExclamationTriangle />
                    </button>
                    <div className='absolute hidden mb-2 transform -translate-x-1/2 w-28 bottom-full left-1/2 group-hover:block'>
                      <div className='px-2 py-1 mx-auto text-xs text-white bg-gray-700 rounded'>Report the issue</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expandable Details */}

              {expandedRequests[request._id] && (
                <div className='p-4 mt-4 border-t border-gray-200'>
                  <p className='text-gray-600'>Scheduled Collection Date: {request.collectionDate}</p>
                  <p className='text-gray-600'>Scheduled Collection Time: {request.collectionTime}</p>
                  <p className='text-gray-600'>Resident Address: {request.resident?.address}</p>
                  <p className='text-gray-600'>City: {request.resident?.city}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className='text-center text-gray-600'>No requests found for {filter}.</p>
      )}

      {/* Report Issue Modal */}
      {isReportModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75'>
          <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-lg'>
            <h2 className='mb-4 text-xl font-bold text-center'>Report Issue</h2>
            <textarea
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              className='w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
              rows='4'
              placeholder='Describe the issue here...'></textarea>
            <div className='flex justify-end mt-4'>
              <button
                onClick={() => handleSubmitReport(selectedRequestId, issueDescription)} // Pass the requestId and issueDescription
                className='px-4 py-2 mr-2 text-white bg-green-500 rounded-lg hover:bg-green-600'>
                Submit
              </button>

              <button onClick={handleCloseModal} className='px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600'>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollectorProgress;