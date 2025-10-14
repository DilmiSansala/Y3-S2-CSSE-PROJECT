const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  licensePlate: {
    type: String,
    // required: true,
    // unique: true,
  },
  centerId: {
    type: String,
    // required: true,
  },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
