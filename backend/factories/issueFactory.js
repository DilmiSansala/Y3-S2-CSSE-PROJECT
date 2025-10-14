const Issue = require("../models/Issue");

class IssueFactory {
  static createIssue(collectorId, requestId, description, time) {
    return new Issue({
      collectorId,
      requestId,
      description,
      date: new Date(),
      time,
    });
  }
}

module.exports = IssueFactory;

// Factory Pattern (Already Applied in IssueFactory)
// Purpose: This pattern is used to create objects without exposing the instantiation logic to the client. In your code, you’ve used the IssueFactory to handle the creation of the Issue model objects.
// Benefits:
// Encapsulation of object creation.
// Easier to manage the creation of complex objects.
// Facilitates adding different types of issues in the future without modifying much code.
