const Collector = require("../models/collector");
const CollectorRepository = require("../repositories/collectorRepository");

jest.mock("../models/collector");

describe("Collector Repository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findByEmail", () => {
    it("should find a collector by email", async () => {
      const mockCollector = { email: "test@test.com" };

      Collector.findOne.mockResolvedValue(mockCollector);

      const result = await CollectorRepository.findByEmail("test@test.com");

      expect(Collector.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
      expect(result).toEqual(mockCollector);
    });
  });

  describe("create", () => {
    it("should create a new collector", async () => {
      const mockCollectorData = { name: "Test", email: "test@test.com" };
      const mockCollector = new Collector(mockCollectorData);

      Collector.prototype.save.mockResolvedValue(mockCollector);

      const result = await CollectorRepository.create(mockCollectorData);

      expect(Collector.prototype.save).toHaveBeenCalled();
      expect(result).toEqual(mockCollector);
    });
  });
});
