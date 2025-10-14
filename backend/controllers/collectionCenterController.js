const CollectionCenter = require('../models/Center');

// Controller to get all collection centers
exports.getAllCollectionCenters = async (req, res) => {
  try {
    const centers = await CollectionCenter.find();
    res.status(200).json(centers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching collection centers' });
  }
};
