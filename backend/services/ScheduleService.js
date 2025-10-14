// services/ScheduleService.js
const Collector = require("../models/Collector");
const Center = require("../models/Center");
const Vehicle = require("../models/Vehicle");
const ScheduleRepository = require("../repositories/ScheduleRepository");

class ScheduleService {
  /**
   * Validate whether collector, center, and vehicle exist
   * @param {String} collectorId - The ID of the collector
   * @param {String} centerId - The ID of the collection center
   * @param {String} vehicleId - The ID of the vehicle
   * @returns {Object} isValid - Boolean indicating validity
   *                    message - Error message if invalid
   */
  static async validateEntities(collectorId, centerId, vehicleId) {
    const [collector, center, vehicle] = await Promise.all([
      Collector.findById(collectorId),
      Center.findById(centerId),
      Vehicle.findById(vehicleId),
    ]);

    if (!collector) return { isValid: false, message: "Invalid collector." };
    if (!center) return { isValid: false, message: "Invalid center." };
    if (!vehicle) return { isValid: false, message: "Invalid vehicle." };

    return { isValid: true };
  }

  /**
   * Check if a schedule already exists for the specified date, time, and collector
   * @param {String} collectorId - The ID of the collector
   * @param {Date} date - The date of the schedule
   * @param {String} time - The time of the schedule
   * @returns {Boolean} - True if a conflict exists, false otherwise
   */
  static async checkScheduleConflict(collectorId, date, time) {
    const existingSchedule = await ScheduleRepository.findByCollectorDateTime(
      collectorId,
      date,
      time
    );
    return existingSchedule !== null;
  }
}

module.exports = ScheduleService;
