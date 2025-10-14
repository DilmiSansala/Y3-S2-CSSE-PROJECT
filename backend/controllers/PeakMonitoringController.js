const WasteRequest = require("../models/WasteRequest");
const CollectionCenter = require("../models/Center"); // Ensure you import the CollectionCenter model

// Function to get peak collection periods
exports.getPeakMonitoring = async (req, res) => {
  try {
    // Fetch all waste requests with their corresponding collection centers
    const wasteRequests = await WasteRequest.find().populate(
      "collectionCenter"
    );

    if (wasteRequests.length === 0) {
      return res.status(404).json({ message: "No waste requests found." });
    }

    // Create an object to store total quantities by date, time, and center
    const peakData = {};

    wasteRequests.forEach((request) => {
      const date = request.collectionDate.toISOString().split("T")[0]; // Extract date
      const time = request.collectionTime; // Extract time
      const center = request.collectionCenter
        ? request.collectionCenter.name
        : "Unknown Center"; // Get the center name

      // Initialize the date, time, and center in the peakData object if not already present
      if (!peakData[date]) {
        peakData[date] = {};
      }
      if (!peakData[date][time]) {
        peakData[date][time] = {};
      }
      if (!peakData[date][time][center]) {
        peakData[date][time][center] = 0;
      }

      // Accumulate the quantity
      peakData[date][time][center] += parseFloat(request.quantity);
    });

    // Convert peakData object into an array for easier rendering on the frontend
    const peakPeriods = [];

    for (const date in peakData) {
      for (const time in peakData[date]) {
        for (const center in peakData[date][time]) {
          peakPeriods.push({
            date,
            time,
            center,
            totalQuantity: peakData[date][time][center] // Total quantity for this date, time, and center
          });
        }
      }
    }

    res.status(200).json(peakPeriods);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to calculate peak periods.", error });
  }
};
