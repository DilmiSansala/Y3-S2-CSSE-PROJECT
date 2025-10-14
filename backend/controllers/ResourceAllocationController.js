const CollectionCenter = require("../models/Center");

exports.allocateResources = async (req, res) => {
  try {
    // Fetch all collection centers from the database
    const collectionCenters = await CollectionCenter.find({});

    if (!collectionCenters || collectionCenters.length === 0) {
      return res.status(404).json({ message: "No collection centers found." });
    }

    // Declare updatedCenters array outside the loop
    const updatedCenters = [];

    // Loop through each center and allocate resources based on totalQuantity
    for (const center of collectionCenters) {
      // Ensure allocatedResources exist and have required properties
      center.allocatedResources = {
        trucks: center.allocatedResources?.trucks || 0,
        staff: center.allocatedResources?.staff || 0,
        totalQuantity: center.allocatedResources?.totalQuantity || 0
      };

      const totalQuantity = center.allocatedResources.totalQuantity;

      // Allocation logic: 1 truck and 2 staff per 1000kg
      let trucks = Math.ceil(totalQuantity / 1000); // Round up to ensure enough trucks
      let staff = trucks * 2; // 2 staff for each truck

      // Update the allocated resources in the collection center
      center.allocatedResources.trucks = trucks;
      center.allocatedResources.staff = staff;

      // Check if status exists before trying to read it
      if (!center.status) {
        console.warn(`Center with name ${center.name} does not have a status.`);
      } else {
        console.log(`Center status is: ${center.status}`);
      }

      // Add updated center data to the array
      updatedCenters.push({
        centerName: center.name,
        trucksAllocated: trucks,
        staffAllocated: staff,
        totalQuantity: totalQuantity
      });

      // Save changes to the database
      await center.save();
    }

    // Return success response
    return res.status(200).json({
      message: "Resources allocated successfully based on total quantity.",
      centers: updatedCenters
    });
  } catch (error) {
    console.error("Error allocating resources:", error.message, error.stack);
    res.status(500).json({ message: "Failed to allocate resources.", error });
  }
};
