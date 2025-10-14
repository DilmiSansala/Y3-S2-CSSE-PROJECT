//Center.js
const mongoose = require("mongoose");

const collectionCenterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  operatingHours: { type: String, required: true },
  resources: {
    trucks: { type: Number, default: 0 },
    staff: { type: Number, default: 0 }
  },
  allocatedResources: {
    trucks: { type: Number, default: 0 }, // Resources allocated based on peak
    staff: { type: Number, default: 0 },
    totalQuantity: { type: Number, default: 0 } // Default total quantity
  },
  peakHours: { type: [String], default: [] },
  status: { type: String, default: "active" } // Default status
});

module.exports = mongoose.model("CollectionCenter", collectionCenterSchema);
