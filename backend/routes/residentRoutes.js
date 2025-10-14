const express = require("express");
const router = express.Router();
const residentController = require("../controllers/residentController");
const wasteRequestController = require("../controllers/wasteRequestController");
const { protect } = require("../middleware/residentMiddleware");

// Waste request routes (protected)
router.post("/waste/request", protect, wasteRequestController.createWasteRequest);
router.get("/waste/history", protect, wasteRequestController.getUserWasteRequests);

// Protected route for fetching waste progress data
router.get("/waste/progress", protect, wasteRequestController.getWasteProgress);

// Resident profile routes (protected)
router.get("/resident/profile", protect, residentController.getProfile);
router.put("/resident/profile", protect, residentController.updateProfile);


module.exports = router;
