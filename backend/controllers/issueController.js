// controllers/issueController.js
const IssueService = require("../services/issueService");
const issueService = new IssueService();

exports.reportIssue = async (req, res) => {
  const { requestId, issueDescription } = req.body;
  const collectorId = req.user._id;

  if (!requestId || !issueDescription) {
    return res.status(400).json({ message: "Request ID and issue description are required." });
  }

  try {
    // Call the service to handle the issue reporting logic
    const issue = await issueService.reportIssue(collectorId, requestId, issueDescription);
    res.status(201).json({ message: "Issue reported successfully.", issue });
  } catch (error) {
    if (error.message === "Request not found.") {
      return res.status(404).json({ message: error.message });
    }
    console.error("Error reporting issue:", error);
    res.status(500).json({ message: error.message || "Error reporting issue." });
  }
};
