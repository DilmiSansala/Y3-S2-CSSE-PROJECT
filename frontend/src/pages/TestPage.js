import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CenterSelection from "../components/ScheduleForm/CenterSelection";
import CollectorSelection from "../components/ScheduleForm/CollectorSelection";
import VehicleSelection from "../components/ScheduleForm/VehicleSelection";
import DateSelection from "../components/ScheduleForm/DateSelection";
import TimeSelection from "../components/ScheduleForm/TimeSelection";
import RequestList from "../components/ScheduleForm/RequestList";
import { FaCheckCircle } from "react-icons/fa"; // Importing a success icon
import successImage from "../components/assets/success.jpg"; // Example image for success


const ScheduleForm = () => {
  const [collectors, setCollectors] = useState([]);
  const [centers, setCenters] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [formData, setFormData] = useState({
    collectorId: "",
    centerId: "",
    vehicleId: "",
    date: "",
    time: "",
    selectedRequests: [], // Store selected requests
  });
  const [selectedCenter, setSelectedCenter] = useState(null); // Added center state
  const [selectedCollector, setSelectedCollector] = useState(null); // Added collector state
  const [selectedVehicle, setSelectedVehicle] = useState(null); // Added vehicle state

  const [filteredRequests, setFilteredRequests] = useState([]); // State for filtered requests
  const [error, setError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();

  // Fetch collectors
  useEffect(() => {
    const fetchCollectors = async () => {
      try {
        const collectorsRes = await axios.get(
          "http://localhost:3050/api/collector"
        );
        setCollectors(collectorsRes.data);
      } catch (err) {
        setError("Failed to fetch collectors.");
      }
    };
    fetchCollectors();
  }, []);

  // Fetch centers
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const centersRes = await axios.get("http://localhost:3050/api/centers");
        setCenters(centersRes.data);
      } catch (err) {
        setError("Failed to fetch centers.");
      }
    };
    fetchCenters();
  }, []);

  // Fetch vehicles based on selected center
  useEffect(() => {
    if (selectedCenter) {
      const fetchVehicles = async () => {
        try {
          const vehiclesRes = await axios.get(
            `http://localhost:3050/api/vehicles/getVehicles/${selectedCenter}`
          );
          setVehicles(vehiclesRes.data);
        } catch (err) {
          setError("Failed to fetch vehicles.");
        }
      };
      fetchVehicles();
    }
  }, [selectedCenter]);

  // Fetch pending requests
  useEffect(() => {
    if (selectedCenter) {
      const fetchPendingRequests = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3050/api/requests/byCenter/${selectedCenter}`
          );
          setPendingRequests(response.data);
          console.log(response.data);
        } catch (err) {
          setError("Failed to fetch pending requests.");
        }
      };
      fetchPendingRequests();
    }
  }, [selectedCenter]);

  // Filter requests based on selected date
  useEffect(() => {
    if (formData.date && pendingRequests.length > 0) {
      const selectedDate = new Date(formData.date).toISOString().split("T")[0];
      const filtered = pendingRequests.filter((request) => {
        const requestDate = new Date(request.collectionDate)
          .toISOString()
          .split("T")[0];
        return requestDate === selectedDate;
      });
      setFilteredRequests(filtered);
    }
  }, [formData.date, pendingRequests]);

  // Handle checkbox change for request selection
  const handleRequestSelection = (e, requestId) => {
    if (e.target.checked) {
      setFormData({
        ...formData,
        selectedRequests: [...formData.selectedRequests, requestId],
      });
    } else {
      setFormData({
        ...formData,
        selectedRequests: formData.selectedRequests.filter(
          (id) => id !== requestId
        ),
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3050/api/schedule/create", {
        ...formData,
        centerId: selectedCenter,
        collectorId: selectedCollector,
        vehicleId: selectedVehicle,
      });
      setShowSuccessPopup(true);
    } catch (error) {
      setError("Failed to create schedule.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-4xl font-bold mb-6 text-green-600 text-center">
        Create Schedule
      </h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <CenterSelection
        centers={centers}
        selectedCenter={selectedCenter}
        setSelectedCenter={setSelectedCenter} // Pass the function
      />

      <DateSelection
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
      />

      <RequestList
        filteredRequests={filteredRequests}
        handleRequestSelection={handleRequestSelection}
      />

      <CollectorSelection
        collectors={collectors}
        selectedCollector={selectedCollector}
        setSelectedCollector={setSelectedCollector} // Pass the function
      />

      <VehicleSelection
        vehicles={vehicles}
        selectedVehicle={selectedVehicle}
        setSelectedVehicle={setSelectedVehicle} // Pass the function
      />

      <TimeSelection
        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
      />

      <button
        type="submit"
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md font-bold text-lg"
      >
        Create Schedule
      </button>


{showSuccessPopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto text-center relative transition-transform transform hover:scale-105">
      {/* Image Section */}
      <img
        src={successImage} // Example image, replace with your own success image if needed
        alt="Success"
        className="w-24 h-24 mx-auto rounded-full border-4 border-green-600 mb-4"
      />

      {/* Success Icon */}
      <FaCheckCircle className="text-green-600 text-5xl mx-auto mb-4" />

      {/* Success Message */}
      <h3 className="text-3xl font-bold text-green-600 mb-4">
        Schedule Created Successfully!
      </h3>
      <p className="text-gray-700 mb-6">
        Your new schedule has been successfully created. You can now view it in the schedule page.
      </p>

      {/* OK Button */}
      <button
        onClick={() => navigate("/schedulePage")}
        className="bg-green-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 ease-in-out font-bold"
      >
        OK
      </button>

      {/* Decorative Element */}
      <div className="absolute -top-8 -right-8 bg-green-600 w-16 h-16 rounded-full shadow-lg opacity-20"></div>
    </div>
  </div>
)}

    </div>
  );
};

export default ScheduleForm;
