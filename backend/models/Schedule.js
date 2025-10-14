const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema(
  {
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collector",
      required: true,
    },
    center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CollectionCenter",
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "canceled", "accepted"],
      default: "scheduled",
    },
    requests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WasteRequest",
      },
    ],
  },
  { timestamps: true }
);


module.exports = mongoose.model("Schedule", ScheduleSchema);
