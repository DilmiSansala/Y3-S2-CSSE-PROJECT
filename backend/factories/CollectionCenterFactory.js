class CollectionCenterFactory {
  static createCenter(data) {
    if (!data.name) {
      throw new Error("Collection center requires a name.");
    }
    if (data.capacity <= 0) {
      throw new Error("Capacity must be a positive number.");
    }
    if (data.trucks < 0) {
      throw new Error("Number of trucks must be a positive number.");
    }

    return {
      name: data.name,
      location: data.location,
      capacity: data.capacity,
      operatingHours: data.operatingHours,
      resources: {
        trucks: data.trucks || 0,
        staff: data.staff || 0
      },
      status: "active",
      peakHours: []
    };
  }
}
module.exports = CollectionCenterFactory;
