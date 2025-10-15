// backend/models/WasteRequest.js
const mongoose = require('mongoose');

const WasteRequestSchema = new mongoose.Schema({
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resident',
    required: true
  },
  wasteType: { type: String, required: true },

  // ✅ make numeric
  quantity: { type: Number, required: true },

  // ✅ link to a center (optional for older docs)
  collectionCenter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CollectionCenter',
    required: false
  },

  collectionDate: { type: Date, required: true },
  collectionTime: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'collected', 'canceled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WasteRequest', WasteRequestSchema);
