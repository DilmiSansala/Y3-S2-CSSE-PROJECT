// backend/controllers/scheduleController.js
const ScheduleFactory = require("../factories/ScheduleFactory");
const ScheduleRepository = require("../repositories/ScheduleRepository");
const WasteRequest = require("../models/WasteRequest");
const ScheduleService = require("../services/ScheduleService");

exports.createSchedule = async (req, res) => {
  try {
    const { collectorId, centerId, vehicleId, date, time, selectedRequests } =
      req.body;

    // --- Strict input validation ---
    if (!collectorId || !centerId || !vehicleId || !date || !time) {
      return res
        .status(400)
        .json({ message: "collectorId, centerId, vehicleId, date and time are required." });
    }

    if (!Array.isArray(selectedRequests) || selectedRequests.length === 0) {
      return res
        .status(400)
        .json({ message: "Select at least one pending waste request." });
    }

    // Validate collector/center/vehicle existence via service
    const { isValid, message } = await ScheduleService.validateEntities(
      collectorId,
      centerId,
      vehicleId
    );
    if (!isValid) {
      return res.status(400).json({ message });
    }

    // Prevent double booking (same collector/date/time)
    const existingSchedule = await ScheduleRepository.findByCollectorDateTime(
      collectorId,
      date,
      time
    );
    if (existingSchedule) {
      return res.status(409).json({
        message: "A schedule already exists for this collector at the selected date and time.",
      });
    }

    // Ensure every selected request exists AND is still pending
    const requests = await WasteRequest.find({
      _id: { $in: selectedRequests },
      status: "pending",
    });

    if (requests.length !== selectedRequests.length) {
      return res.status(400).json({
        message: "Some selected requests are invalid or not pending.",
      });
    }

    // Mark selected requests as scheduled
    await WasteRequest.updateMany(
      { _id: { $in: selectedRequests } },
      { $set: { status: "scheduled" } }
    );

    // Create the schedule with attached requests
    const newSchedule = await ScheduleFactory.createSchedule({
      collector: collectorId,
      center: centerId,
      vehicle: vehicleId,
      date,
      time,
      requests: selectedRequests,
    });

    return res.status(201).json({
      message: "Schedule created successfully.",
      schedule: newSchedule,
    });
  } catch (error) {
    console.error("Error creating schedule:", error);
    return res
      .status(500)
      .json({ message: "Error creating schedule.", error });
  }
};


// Get all schedules for a specific collector
exports.getCollectorSchedules = async (req, res) => {
  try {
    const { collectorId } = req.params;
    if (!collectorId) {
      return res.status(400).json({ message: "Collector ID is required." });
    }

    const schedules = await ScheduleRepository.findByCollector(collectorId);
    if (!schedules.length) {
      return res
        .status(404)
        .json({ message: "No schedules found for this collector." });
    }

    return res.status(200).json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return res
      .status(500)
      .json({ message: "Error fetching schedules.", error });
  }
};

// Get all schedules
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await ScheduleRepository.findAll();
    return res.status(200).json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return res.status(500).json({ message: "Error fetching schedules", error });
  }
};

exports.getSchedulesByCenter = async (req, res) => {
  try {
    const { centerId } = req.params;
    if (!centerId) {
      return res.status(400).json({ message: "Center ID is required." });
    }

    const schedules = await ScheduleRepository.findByCenter(centerId);

    // ✅ 200, never 404
    return res.status(200).json(Array.isArray(schedules) ? schedules : []);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return res.status(500).json({ message: "Error fetching schedules.", error });
  }
};
// Update schedule status to 'accepted'
exports.updateScheduleStatus = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    if (!scheduleId) {
      return res.status(400).json({ message: "Schedule ID is required." });
    }

    const updatedSchedule = await ScheduleRepository.updateById(scheduleId, {
      status: "accepted",
    });
    if (!updatedSchedule) {
      return res.status(404).json({ message: "Schedule not found." });
    }

    return res
      .status(200)
      .json({ message: "Schedule accepted.", schedule: updatedSchedule });
  } catch (error) {
    console.error("Error updating schedule status:", error);
    return res
      .status(500)
      .json({ message: "Error updating schedule status.", error });
  }
};

// Update schedule status to 'canceled'
exports.cancelSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    if (!scheduleId) {
      return res.status(400).json({ message: "Schedule ID is required." });
    }

    const updatedSchedule = await ScheduleRepository.updateById(scheduleId, {
      status: "canceled",
    });
    if (!updatedSchedule) {
      return res.status(404).json({ message: "Schedule not found." });
    }

    return res
      .status(200)
      .json({ message: "Schedule canceled.", schedule: updatedSchedule });
  } catch (error) {
    console.error("Error canceling schedule:", error);
    return res
      .status(500)
      .json({ message: "Error canceling schedule.", error });
  }
};
