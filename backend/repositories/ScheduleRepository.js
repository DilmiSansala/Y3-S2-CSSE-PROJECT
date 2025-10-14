const Schedule = require("../models/Schedule");

class ScheduleRepository {
  // Create a new schedule
  async create(scheduleData) {
    const schedule = new Schedule(scheduleData);
    return await schedule.save();
  }

  // Find a schedule by its ID
  async findById(id) {
    return await Schedule.findById(id)
      .populate("collector")
      .populate("center")
      .populate("vehicle")
      .populate("requests");
  }

  // Find a schedule by collector, date, and time
  async findByCollectorDateTime(collectorId, date, time) {
    return await Schedule.findOne({
      collector: collectorId,
      date: date,
      time: time,
    });
  }

  // Find all schedules
  async findAll() {
    return await Schedule.find()
      .populate("collector")
      .populate("center")
      .populate("vehicle")
      .populate("requests");
  }

  // Find schedules for a specific collector
  async findByCollector(collectorId) {
    return await Schedule.find({ collector: collectorId })
      .populate("collector")
      .populate("center")
      .populate("vehicle")
      .populate("requests");
  }

  // Find schedules for a specific collection center
  async findByCenter(centerId) {
    return await Schedule.find({ center: centerId })
      .populate("collector")
      .populate("center")
      .populate("vehicle")
      .populate("requests");
  }

  // Update a schedule by its ID
  async updateById(id, updateData) {
    return await Schedule.findByIdAndUpdate(id, updateData, { new: true })
      .populate("collector")
      .populate("center")
      .populate("vehicle")
      .populate("requests");
  }

  // Delete a schedule by its ID
  async deleteById(id) {
    return await Schedule.findByIdAndDelete(id);
  }
}

module.exports = new ScheduleRepository();
