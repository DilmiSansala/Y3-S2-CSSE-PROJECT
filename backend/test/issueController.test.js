// tests/issueController.test.js
const issueController = require("../controllers/issueController");
const IssueFactory = require("../factories/issueFactory");
const WasteRequestRepository = require("../repositories/wasteRequestRepository");
const IssueRepository = require("../repositories/issueRepository");

jest.mock("../factories/issueFactory");
jest.mock("../repositories/wasteRequestRepository");
jest.mock("../repositories/issueRepository");

describe("Issue Controller - reportIssue", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        requestId: "testRequestId",
        issueDescription: "Test issue description",
      },
      user: {
        _id: "testCollectorId",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {}); // Mock console.error to suppress the output
  });

  afterEach(() => {
    console.error.mockRestore(); // Restore console.error after each test
  });

  it("should report an issue successfully", async () => {
    const mockWasteRequest = {
      _id: "testRequestId",
      resident: "testResidentId",
    };

    const mockIssue = {
      collectorId: "testCollectorId",
      requestId: "testRequestId",
      description: "Test issue description",
      date: new Date(),
      time: Date.now(),
    };

    WasteRequestRepository.findById.mockResolvedValue(mockWasteRequest);
    IssueFactory.createIssue.mockReturnValue(mockIssue);
    IssueRepository.create.mockResolvedValue(mockIssue);

    await issueController.reportIssue(req, res);

    expect(WasteRequestRepository.findById).toHaveBeenCalledWith(req.body.requestId);
    expect(IssueFactory.createIssue).toHaveBeenCalledWith(req.user._id, req.body.requestId, req.body.issueDescription, expect.any(Number));
    expect(IssueRepository.create).toHaveBeenCalledWith(mockIssue);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "Issue reported successfully.", issue: mockIssue });
  });

  it("should return an error if request ID or issue description is missing", async () => {
    req.body.requestId = null;

    await issueController.reportIssue(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Request ID and issue description are required." });
  });

  it("should return 404 if waste request is not found", async () => {
    WasteRequestRepository.findById.mockResolvedValue(null); // Mock waste request not found

    await issueController.reportIssue(req, res);

    expect(WasteRequestRepository.findById).toHaveBeenCalledWith(req.body.requestId);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Request not found." });
  });

  it("should handle errors during issue reporting", async () => {
    const mockError = new Error("Database error");

    WasteRequestRepository.findById.mockRejectedValue(mockError); // Simulate an error

    await issueController.reportIssue(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
  });
});
