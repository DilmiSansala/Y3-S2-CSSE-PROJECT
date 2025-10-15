// backend/controllers/ResourceAllocationController.js
const CollectionCenter = require("../models/Center");
const WasteRequest = require("../models/WasteRequest");

// tune as needed
const TRUCK_CAPACITY_KG = 1000; // 1 truck per 1000 kg
const STAFF_PER_TRUCK   = 2;    // 2 staff per truck

exports.allocateResources = async (req, res) => {
  try {
    // 1) total quantity per center (handle legacy string/number quantities)
    const sums = await WasteRequest.aggregate([
      { $match: { collectionCenter: { $ne: null } } },
      {
        $group: {
          _id: "$collectionCenter",
          totalQuantity: {
            $sum: {
              $cond: [
                { $isNumber: "$quantity" },
                "$quantity",
                { $toDouble: "$quantity" }
              ]
            }
          }
        }
      }
    ]);

    const totalsById = new Map(sums.map(x => [String(x._id), x.totalQuantity || 0]));

    // 2) load centers and save allocatedResources
    const centers = await CollectionCenter.find({}).lean(false); // need real docs to save
    const out = [];

    for (const c of centers) {
      const id = String(c._id);
      const totalQty = totalsById.get(id) || 0;

      // compute need based on demand
      const trucksNeeded = Math.ceil(totalQty / TRUCK_CAPACITY_KG);
      const staffNeeded  = trucksNeeded * STAFF_PER_TRUCK;

      // cap by available resources if you set them on center.resources
      const maxTrucks = Number(c.resources?.trucks ?? trucksNeeded);
      const maxStaff  = Number(c.resources?.staff  ?? staffNeeded);

      // 🚫 DO NOT reduce below current allocated amounts
      const existingTrucks = Number(c.allocatedResources?.trucks || 0);
      const existingStaff  = Number(c.allocatedResources?.staff  || 0);

      const trucksFinal = Math.max(
        existingTrucks,
        Math.min(maxTrucks, trucksNeeded)
      );
      const staffFinal  = Math.max(
        existingStaff,
        Math.min(maxStaff,  staffNeeded)
      );

      c.allocatedResources = {
        trucks: trucksFinal,
        staff:  staffFinal,
        totalQuantity: Number(totalQty) || 0
      };

      await c.save();

      out.push({
        centerId: id,
        centerName: c.name,
        trucksAllocated: c.allocatedResources.trucks,
        staffAllocated: c.allocatedResources.staff,
        totalQuantity: c.allocatedResources.totalQuantity
      });
    }

    return res.status(200).json({ message: "Resources allocated.", centers: out });
  } catch (err) {
    console.error("allocateResources error:", err);
    return res.status(500).json({
      message: "Failed to allocate resources.",
      error: String(err?.message || err)
    });
  }
};
