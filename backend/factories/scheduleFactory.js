const Schedule = require("../models/Schedule");

class ScheduleFactory {
  static async createSchedule({
    collector,
    center,
    vehicle,
    date,
    time,
    requests,
  }) {
    const schedule = new Schedule({
      collector,
      center,
      vehicle,
      date,
      time,
      status: "scheduled", // Default status
      requests, // Save the requests
    });
    await schedule.save();
    return schedule;
  }
}

module.exports = ScheduleFactory;
