const ScheduleService = require("../services/ScheduleService");
const Collector = require("../models/Collector");
const Center = require("../models/Center");
const Vehicle = require("../models/Vehicle");
const ScheduleRepository = require("../repositories/ScheduleRepository");

// Mock Mongoose models and repository methods
jest.mock("../models/Collector");
jest.mock("../models/Center");
jest.mock("../models/Vehicle");
jest.mock("../repositories/ScheduleRepository");

describe("ScheduleService Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("validateEntities", () => {
    it("should return false if collector does not exist", async () => {
      Collector.findById.mockResolvedValue(null);
      Center.findById.mockResolvedValue({ _id: "center1" });
      Vehicle.findById.mockResolvedValue({ _id: "vehicle1" });

      const result = await ScheduleService.validateEntities(
        "invalidCollectorId",
        "center1",
        "vehicle1"
      );

      expect(Collector.findById).toHaveBeenCalledWith("invalidCollectorId");
      expect(Center.findById).toHaveBeenCalledWith("center1");
      expect(Vehicle.findById).toHaveBeenCalledWith("vehicle1");
      expect(result).toEqual({ isValid: false, message: "Invalid collector." });
    });

    it("should return false if center does not exist", async () => {
      Collector.findById.mockResolvedValue({ _id: "collector1" });
      Center.findById.mockResolvedValue(null);
      Vehicle.findById.mockResolvedValue({ _id: "vehicle1" });

      const result = await ScheduleService.validateEntities(
        "collector1",
        "invalidCenterId",
        "vehicle1"
      );

      expect(Collector.findById).toHaveBeenCalledWith("collector1");
      expect(Center.findById).toHaveBeenCalledWith("invalidCenterId");
      expect(Vehicle.findById).toHaveBeenCalledWith("vehicle1");
      expect(result).toEqual({ isValid: false, message: "Invalid center." });
    });

    it("should return false if vehicle does not exist", async () => {
      Collector.findById.mockResolvedValue({ _id: "collector1" });
      Center.findById.mockResolvedValue({ _id: "center1" });
      Vehicle.findById.mockResolvedValue(null);

      const result = await ScheduleService.validateEntities(
        "collector1",
        "center1",
        "invalidVehicleId"
      );

      expect(Collector.findById).toHaveBeenCalledWith("collector1");
      expect(Center.findById).toHaveBeenCalledWith("center1");
      expect(Vehicle.findById).toHaveBeenCalledWith("invalidVehicleId");
      expect(result).toEqual({ isValid: false, message: "Invalid vehicle." });
    });

    it("should return true if all entities exist", async () => {
      Collector.findById.mockResolvedValue({ _id: "collector1" });
      Center.findById.mockResolvedValue({ _id: "center1" });
      Vehicle.findById.mockResolvedValue({ _id: "vehicle1" });

      const result = await ScheduleService.validateEntities(
        "collector1",
        "center1",
        "vehicle1"
      );

      expect(Collector.findById).toHaveBeenCalledWith("collector1");
      expect(Center.findById).toHaveBeenCalledWith("center1");
      expect(Vehicle.findById).toHaveBeenCalledWith("vehicle1");
      expect(result).toEqual({ isValid: true });
    });
  });

  describe("checkScheduleConflict", () => {
    it("should return true if a schedule conflict exists", async () => {
      ScheduleRepository.findByCollectorDateTime.mockResolvedValue({
        _id: "existingSchedule",
        date: "2024-10-01",
        time: "09:00 AM",
      });

      const result = await ScheduleService.checkScheduleConflict(
        "collector1",
        "2024-10-01",
        "09:00 AM"
      );

      expect(ScheduleRepository.findByCollectorDateTime).toHaveBeenCalledWith(
        "collector1",
        "2024-10-01",
        "09:00 AM"
      );
      expect(result).toBe(true);
    });

    it("should return false if no schedule conflict exists", async () => {
      ScheduleRepository.findByCollectorDateTime.mockResolvedValue(null);

      const result = await ScheduleService.checkScheduleConflict(
        "collector1",
        "2024-10-01",
        "09:00 AM"
      );

      expect(ScheduleRepository.findByCollectorDateTime).toHaveBeenCalledWith(
        "collector1",
        "2024-10-01",
        "09:00 AM"
      );
      expect(result).toBe(false);
    });
  });
});
