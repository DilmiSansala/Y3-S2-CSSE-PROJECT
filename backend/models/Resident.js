const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ResidentSchema = new mongoose.Schema({
  residentName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  usertype: {
    type: String,
    enum: ['resident', 'collector', 'admin'],
    default: 'resident',
  },
}, { timestamps: true });

// Hash password before saving to database
ResidentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password during login
ResidentSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Resident', ResidentSchema);
