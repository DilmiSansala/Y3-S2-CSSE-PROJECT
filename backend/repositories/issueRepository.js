const Issue = require("../models/Issue");

class IssueRepository {
  async create(issueData) {
    const issue = new Issue(issueData);
    return await issue.save();
  }

  async findByRequestId(requestId) {
    return await Issue.findOne({ requestId });
  }
}

module.exports = new IssueRepository();
