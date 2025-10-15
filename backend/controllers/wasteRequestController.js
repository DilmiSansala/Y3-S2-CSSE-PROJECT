const WasteRequest = require("../models/WasteRequest");
const Resident = require("../models/Resident");
const mongoose = require("mongoose");
const moment = require("moment");

// Create a new waste request
exports.createWasteRequest = async (req, res) => {
  try {
    // Check if the database connection is ready
    if (mongoose.connection.readyState !== 1) {
      return res
        .status(500)
        .json({ message: "Database connection is not established." });
    }

    const { wasteType, quantity, collectionDate, collectionTime,collectionCenter  } = req.body;

    // Validate request data
    if (!wasteType || !quantity || !collectionDate || !collectionTime) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new waste request
    const newWasteRequest = new WasteRequest({
       resident: req.user.id,
  wasteType,
  quantity: Number(quantity),             // ← cast to number
  collectionCenter: collectionCenter || undefined, // ← store center id when sent
  collectionDate,
  collectionTime
    });

    await newWasteRequest.save();
    res.status(201).json({ message: "Waste request created successfully." });
  } catch (error) {
    console.error("Error creating waste request:", error);
    res.status(500).json({ message: "Error creating waste request.", error });
  }
};

// Get all waste requests for the logged-in user
exports.getUserWasteRequests = async (req, res) => {
  try {
    // Check if the database connection is ready
    if (mongoose.connection.readyState !== 1) {
      return res
        .status(500)
        .json({ message: "Database connection is not established." });
    }

    const requests = await WasteRequest.find({ resident: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching waste requests:", error);
    res.status(500).json({ message: "Error fetching waste requests.", error });
  }
};

// Get waste progress data
exports.getWasteProgress = async (req, res) => {
  try {
    // Check if the database connection is ready
    if (mongoose.connection.readyState !== 1) {
      return res
        .status(500)
        .json({ message: "Database connection is not established." });
    }

    const wasteRequests = await WasteRequest.find();
    res.status(200).json(wasteRequests);
  } catch (error) {
    console.error("Error fetching waste progress data:", error);
    res
      .status(500)
      .json({ message: "Error fetching waste progress data.", error });
  }
};

// Get requests based on filter (today, yesterday, week, month, upcoming)
exports.getRequestsByFilter = async (req, res) => {
  const { filter } = req.query;
  const today = moment().startOf("day");
  const tomorrow = moment(today).add(1, "days");
  const yesterday = moment(today).subtract(1, "days");
  const weekStart = moment(today).startOf("week");
  const monthStart = moment(today).startOf("month");

  let dateFilter;

  switch (filter) {
    case "today":
      dateFilter = {
        collectionDate: {
          // Includes all times today (from 00:00 to 23:59)
          $gte: today.toDate(),
          $lt: tomorrow.toDate(),
        },
      };
      break;
    case "yesterday":
      dateFilter = {
        collectionDate: {
          // Only includes yesterday's date
          $gte: yesterday.toDate(),
          $lt: today.toDate(),
        },
      };
      break;
    case "week":
      dateFilter = {
        collectionDate: {
          // Includes requests from the start of the week to tomorrow (this ensures "today" is included)
          $gte: weekStart.toDate(),
          $lt: tomorrow.toDate(),
        },
      };
      break;
    case "month":
      dateFilter = {
        collectionDate: {
          // Includes requests from the start of the month to tomorrow
          $gte: monthStart.toDate(),
          $lt: tomorrow.toDate(),
        },
      };
      break;
    case "upcoming":
      dateFilter = {
        // Includes requests starting from tomorrow onwards
        collectionDate: {
          $gte: tomorrow.toDate(),
        },
      };
      break;
    default:
      return res.status(400).json({ message: "Invalid filter" });
  }

  try {
    const requests = await WasteRequest.find(dateFilter).populate("resident");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error });
  }
};

// Mark the request as collected
exports.markAsCollected = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await WasteRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Update the status to 'collected'
    request.status = "collected";
    await request.save();

    res.status(200).json({ message: "Request marked as collected" });
  } catch (error) {
    res.status(500).json({ message: "Error updating request status", error });
  }
};

// Mark the request as pending (if unchecked)
exports.markAsPending = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await WasteRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Update the status to 'pending'
    request.status = "pending";
    await request.save();

    res.status(200).json({ message: "Request marked as pending" });
  } catch (error) {
    res.status(500).json({ message: "Error updating request status", error });
  }
};

// get all request into the database
exports.getAllRequest = async (req, res) => {
  try {
    const requests = await WasteRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching waste requests:", error);
    res.status(500).json({ message: "Error fetching waste requests.", error });
  }
};

// Get all pending requests by collection center (centerId as ObjectId)
exports.getRequestsByCenter = async (req, res) => {
  const { centerId } = req.params;

  try {
    if (!centerId) {
      return res.status(400).json({ message: "Center ID is required." });
    }

    // Support both legacy string and new ObjectId `collectionCenter`
    const orList = [{ collectionCenter: centerId }];
    if (mongoose.isValidObjectId(centerId)) {
      orList.push({ collectionCenter: new mongoose.Types.ObjectId(centerId) });
    }

    const pendingRequests = await WasteRequest.find({
      $or: orList,
      status: "pending",
    }).populate("resident");

    // ✅ 200, even when empty
    return res.status(200).json(Array.isArray(pendingRequests) ? pendingRequests : []);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    return res.status(500).json({ message: "Error fetching pending requests." });
  }
};
