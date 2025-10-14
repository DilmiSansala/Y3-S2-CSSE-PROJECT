const mongoose = require("mongoose");
const collectorController = require("../controllers/collectorController");
const CollectorRepository = require("../repositories/collectorRepository");
const JwtService = require("../services/jwtService");

// Set the JWT_SECRET for testing
process.env.JWT_SECRET = "testsecret";

// Mocking repository and JWT service functions
jest.mock("../repositories/collectorRepository");
jest.mock("../services/jwtService", () => ({
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
}));

describe("Collector Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      user: {
        id: "testCollectorId",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signupCollector", () => {
    it("should register a new collector successfully", async () => {
      const mockCenterId = new mongoose.Types.ObjectId();

      const mockCollectorData = {
        name: "Test",
        phone: "12345",
        email: "test@test.com",
        password: "password",
        city: "TestCity",
        center: mockCenterId,
      };

      const mockCollector = {
        _id: new mongoose.Types.ObjectId(),
        ...mockCollectorData,
      };

      CollectorRepository.findByEmail.mockResolvedValue(null);
      CollectorRepository.create.mockResolvedValue(mockCollector);

      req.body = mockCollectorData;

      await collectorController.signupCollector(req, res, next);

      expect(CollectorRepository.findByEmail).toHaveBeenCalledWith(req.body.email);
      expect(CollectorRepository.create).toHaveBeenCalledWith(expect.objectContaining(mockCollectorData));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Collector registered successfully.",
        collector: mockCollector,
      });
    });

    it("should return an error if email is already in use", async () => {
      CollectorRepository.findByEmail.mockResolvedValue({ email: "existing@test.com" });

      req.body = { email: "existing@test.com" };

      await collectorController.signupCollector(req, res, next);

      expect(CollectorRepository.findByEmail).toHaveBeenCalledWith(req.body.email);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Email already in use." });
    });
  });
});
