const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const wasteController = require("../controllers/wasteController");
const residentController = require("../controllers/residentController");
const collectionCenterController = require("../controllers/collectionCenterController");
const paymentController = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");

// Authentication routes
router.post("/signup", authController.signupResident);
router.post("/login", authController.loginResident);

// Waste request routes (protected)
router.post("/waste/request", protect, wasteController.createWasteRequest);
router.get("/waste/history", protect, wasteController.getUserWasteRequests);
router.put("/waste/request/:id", protect, wasteController.updateWasteRequest); // Edit request
router.delete(
  "/waste/request/:id",
  protect,
  wasteController.deleteWasteRequest
); // Delete request

// Protected route for fetching waste progress data
router.get("/waste/progress", protect, wasteController.getWasteProgress);

// Resident profile routes (protected)
router.get("/resident/profile", protect, residentController.getProfile);
router.put("/resident/profile", protect, residentController.updateProfile);

// Route to get all collection centers (protected)
router.get(
  "/collection-centers",
  protect,
  collectionCenterController.getAllCollectionCenters
);

// Payment routes (protected)
router.post("/payment/process", protect, paymentController.processPayment);

// Login route for admin
router.post("/admin/login", authController.loginAdmin);

module.exports = router;
