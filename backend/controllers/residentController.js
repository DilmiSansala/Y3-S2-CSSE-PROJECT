const Resident = require('../models/Resident');

// Get resident profile
exports.getProfile = async (req, res) => {
  try {
    const resident = await Resident.findById(req.user.id).select('-password');
    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }
    res.status(200).json(resident);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update resident profile
exports.updateProfile = async (req, res) => {
  const { residentName, address, city, phone, password } = req.body;
  try {
    const resident = await Resident.findById(req.user.id);

    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }

    if (residentName) resident.residentName = residentName;
    if (address) resident.address = address;
    if (city) resident.city = city;
    if (phone) resident.phone = phone;
    if (password) {
      resident.password = password;
    }

    await resident.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
