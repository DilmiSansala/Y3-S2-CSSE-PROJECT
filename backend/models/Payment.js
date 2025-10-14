const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "completed",
  },
  wasteRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WasteRequest",
    },
  ],
});

module.exports = mongoose.model("Payment", paymentSchema);
