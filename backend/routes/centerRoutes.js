const express = require("express");
const router = express.Router();
const collectionCenterController = require("../controllers/centerController");
const peakMonitoringController = require("../controllers/PeakMonitoringController");
const resourceAllocationController = require("../controllers/ResourceAllocationController");

// CRUD operations for collection centers
router.post("/", collectionCenterController.addCenter);
router.get("/", collectionCenterController.getCenters);
router.put("/:id", collectionCenterController.updateCenter);
router.delete("/:id", collectionCenterController.deleteCenter);

router.get("/peak-monitoring", peakMonitoringController.getPeakMonitoring);
router.post(
  "/allocate-resources",
  resourceAllocationController.allocateResources
);
module.exports = router;
