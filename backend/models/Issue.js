const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema({
  collectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collector",
    required: true,
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WasteRequest",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  time: {
    type: String,
    default: () => new Date().toLocaleTimeString(),
    required: true,
  },
});

module.exports = mongoose.model("Issue", IssueSchema);
