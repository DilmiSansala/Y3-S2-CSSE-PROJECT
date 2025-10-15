// backend/controllers/vehicleController.js
const Vehicle = require("../models/Vehicle");

// Create a new vehicle
exports.createVehicle = async (req, res) => {
  try {
    const { name, licensePlate, centerId } = req.body;
    if (!name || !licensePlate || !centerId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newVehicle = new Vehicle({ name, licensePlate, centerId });
    await newVehicle.save();

    res.status(201).json({ message: "Vehicle added successfully", vehicle: newVehicle });
  } catch (error) {
    res.status(500).json({ message: "Error adding vehicle", error });
  }
};

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate("centerId", "name"); // Populate center's name
    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ message: "Error fetching vehicles.", error });
  }
};

// Get a single vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate(
      "centerId",
      "name"
    );
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found." });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({ message: "Error fetching vehicle.", error });
  }
};

// Update a vehicle by ID
exports.updateVehicle = async (req, res) => {
  try {
    const { name, licensePlate, centerId } = req.body;

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { name, licensePlate, centerId },
      { new: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({ message: "Vehicle not found." });
    }

    res.status(200).json({
      message: "Vehicle updated successfully.",
      vehicle: updatedVehicle,
    });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({ message: "Error updating vehicle.", error });
  }
};

// Delete a vehicle by ID
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found." });
    }
    res.status(200).json({ message: "Vehicle deleted successfully." });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ message: "Error deleting vehicle.", error });
  }
};

// ✅ Always return 200 with an array (even if empty)
exports.getVehiclesByCenter = async (req, res) => {
  try {
    const { centerId } = req.params;
    if (!centerId) {
      return res.status(400).json({ message: "Center ID is required." });
    }

    // Vehicle model uses `centerId` as a STRING field
    const vehicles = await Vehicle.find({ centerId });
    return res.status(200).json(Array.isArray(vehicles) ? vehicles : []);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ message: "Error fetching vehicles.", error });
  }
};
