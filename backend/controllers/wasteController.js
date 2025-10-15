const WasteRequest = require('../models/WasteRequest');
const CollectionCenter = require('../models/Center');
const mongoose = require('mongoose');

// Create a new waste request
exports.createWasteRequest = async (req, res) => {
  try {
    // Check if the database connection is ready
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: 'Database connection is not established.' });
    }

    const { wasteType, quantity, collectionDate, collectionTime, collectionCenter } = req.body;

    // Validate request data
    if (!wasteType || !quantity || !collectionDate || !collectionTime || !collectionCenter) {
      return res.status(400).json({ message: 'All fields are required, including collection center.' });
    }

    // Check if the provided collectionCenter is valid
    const validCenter = await CollectionCenter.findById(collectionCenter);
    if (!validCenter) {
      return res.status(400).json({ message: 'Invalid collection center selected.' });
    }

    // Create a new waste request
    const newWasteRequest = new WasteRequest({
      resident: req.user.id,
      wasteType,
      quantity,
      collectionDate,
      collectionTime,
      collectionCenter, // Reference to collection center
    });

    await newWasteRequest.save();
    res.status(201).json({ message: 'Waste request created successfully.' });
  } catch (error) {
    console.error('Error creating waste request:', error);
    res.status(500).json({ message: 'Error creating waste request.', error });
  }
};

// Get all waste requests for the logged-in user
exports.getUserWasteRequests = async (req, res) => {
  try {
    // Check if the database connection is ready
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: 'Database connection is not established.' });
    }

    // Fetch waste requests with populated collection center information
    const requests = await WasteRequest.find({ resident: req.user.id }).populate('collectionCenter').sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching waste requests:', error);
    res.status(500).json({ message: 'Error fetching waste requests.', error });
  }
};

// Get waste progress data for logged-in user
exports.getWasteProgress = async (req, res) => {
  try {
    // Check if the database connection is ready
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: 'Database connection is not established.' });
    }

    // Fetch waste requests only for the logged-in user with populated collection center info
    const wasteRequests = await WasteRequest.find({ resident: req.user.id }).populate('collectionCenter');

    // If no waste requests are found
    if (!wasteRequests || wasteRequests.length === 0) {
      return res.status(404).json({ message: 'No waste requests found for this user.' });
    }

    res.status(200).json(wasteRequests);
  } catch (error) {
    console.error('Error fetching waste progress data:', error);
    res.status(500).json({ message: 'Error fetching waste progress data.', error });
  }
};

// Update a waste request
// Update a waste request (partial updates allowed)
exports.updateWasteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Accept any subset of fields from the client
    const {
      wasteType,
      quantity,
      collectionDate,
      collectionTime,
      status,
      collectionCenter
    } = req.body;

    // Build the update payload only with provided fields
    const update = {};

    if (typeof wasteType !== "undefined") update.wasteType = wasteType;

    if (typeof quantity !== "undefined") {
      const qn = Number(quantity);
      if (!Number.isFinite(qn) || qn < 0) {
        return res.status(400).json({ message: "quantity must be a non-negative number" });
      }
      update.quantity = qn;
    }

    if (typeof collectionDate !== "undefined") update.collectionDate = collectionDate; // Mongoose will cast
    if (typeof collectionTime !== "undefined") update.collectionTime = collectionTime;

    if (typeof status !== "undefined") {
      // optional: enforce your enum here if you want
      update.status = status;
    }

    if (typeof collectionCenter !== "undefined" && collectionCenter !== null && collectionCenter !== "") {
      // Only validate center if the client tries to change it
      const validCenter = await mongoose.model("CollectionCenter").findById(collectionCenter);
      if (!validCenter) {
        return res.status(400).json({ message: "Invalid collection center selected." });
      }
      update.collectionCenter = collectionCenter;
    }

    // If client sent nothing recognizable, bail out
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "No valid fields provided to update." });
    }

    const updatedRequest = await mongoose
      .model("WasteRequest")
      .findByIdAndUpdate(id, update, { new: true })
      .populate("collectionCenter");

    if (!updatedRequest) {
      return res.status(404).json({ message: "Waste request not found." });
    }

    return res.status(200).json(updatedRequest);
  } catch (error) {
    console.error("Error updating waste request:", error);
    return res.status(500).json({ message: "Error updating waste request.", error });
  }
};


// Delete a waste request
exports.deleteWasteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRequest = await WasteRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({ message: 'Waste request not found.' });
    }

    res.status(200).json({ message: 'Waste request deleted successfully.' });
  } catch (error) {
    console.error('Error deleting waste request:', error);
    res.status(500).json({ message: 'Error deleting waste request.', error });
  }
};
