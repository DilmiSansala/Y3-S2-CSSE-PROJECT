const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController"); // Make sure this path is correct
// const { protect, adminOnly } = require("../middleware/authMiddleware");

// Protected routes for creating schedules
router.post("/create", scheduleController.createSchedule); // Ensure `createSchedule` is defined

// Get all schedules for a specific collector
router.get("/collector/:collectorId", scheduleController.getCollectorSchedules);

// Get all schedules
router.get("/getAll", scheduleController.getAllSchedules); // Route for getting all schedules

// Route to get schedules by collection center
router.get("/getByCenter/:centerId", scheduleController.getSchedulesByCenter);

// -----------------------Yasiru---------------------------
router.put("/accept/:scheduleId", scheduleController.updateScheduleStatus);
router.put("/cancel/:scheduleId", scheduleController.cancelSchedule);

module.exports = router;
