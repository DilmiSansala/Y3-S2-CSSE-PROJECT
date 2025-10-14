const express = require("express");
const router = express.Router();
const collectorController = require("../controllers/collectorController");
const { protectCollector } = require("../middleware/collectorMiddleware");

// Collector authentication routes
router.post("/signup", collectorController.signupCollector);
router.post("/signin", collectorController.signInCollector);

// Collector profile routes (protected)
router.get(
  "/profile",
  protectCollector,
  collectorController.getProfile ||
    function (req, res) {
      res.status(500).json({ message: "getProfile function not implemented." });
    }
);

router.put(
  "/profile",
  protectCollector,
  collectorController.updateProfile ||
    function (req, res) {
      res.status(500).json({ message: "updateProfile function not implemented." });
    }
);

// Route to get all collectors/Vilan
router.get("/", collectorController.getAllCollectors);

module.exports = router;
