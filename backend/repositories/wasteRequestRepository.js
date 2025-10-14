const WasteRequest = require("../models/WasteRequest");

class WasteRequestRepository {
  async findById(id) {
    return await WasteRequest.findById(id);
  }
}

module.exports = new WasteRequestRepository();
