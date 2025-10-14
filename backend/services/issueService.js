const IssueFactory = require("../factories/issueFactory");
const WasteRequestRepository = require("../repositories/wasteRequestRepository");
const IssueRepository = require("../repositories/issueRepository");

class IssueService {
  async reportIssue(collectorId, requestId, description) {
    // Validate if the waste request exists
    const request = await WasteRequestRepository.findById(requestId);
    if (!request) {
      throw new Error("Request not found.");
    }

    // Create issue object using the factory
    const issueData = IssueFactory.createIssue(collectorId, requestId, description, Date.now());

    // Save the issue using the repository
    return await IssueRepository.create(issueData);
  }
}

module.exports = IssueService;
