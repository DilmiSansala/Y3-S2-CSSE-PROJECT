const express = require("express");
const router = express.Router();
const issueController = require("../controllers/issueController");
const { protectCollector } = require("../middleware/collectorMiddleware"); // Middleware to check JWT

// Report an issue
router.post("/report", protectCollector, issueController.reportIssue);

module.exports = router;
