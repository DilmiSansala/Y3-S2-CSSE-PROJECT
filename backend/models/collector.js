const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const CollectorSchema = new mongoose.Schema(
  {
    name: {
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
      default: "collector",
    },
    city: {
      type: String,
      required: true,
    },
    center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Center",
    },
  },
  { timestamps: true } // Automatically adds 'createdAt' and 'updatedAt' fields
);

// Hash password before saving
CollectorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
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
CollectorSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Virtual: isExperienced (>= 2 years since createdAt)
CollectorSchema.virtual("isExperienced").get(function () {
  // createdAt may be undefined during construction or manual inserts
  const createdAt = this.createdAt instanceof Date ? this.createdAt : null;
  if (!createdAt) return false;

  // safer year difference using milliseconds
  const years =
    (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return years > 2;
});


// Enable virtuals to be included in JSON and Object outputs
CollectorSchema.set("toJSON", { virtuals: true });
CollectorSchema.set("toObject", { virtuals: true });

// Check if the model already exists before creating it
module.exports = mongoose.models.Collector || mongoose.model("Collector", CollectorSchema);

// Applied Pattern: Active Record Pattern
// How it Works:

// In your collectorModel.js, you are using the Active Record Pattern via Mongoose, which combines both data and behavior in a single class (schema). The model not only defines the data structure (fields like name, email, password, etc.) but also includes behavior like hashing passwords before saving and comparing passwords during login.

// Mongoose allows you to define schema methods like comparePassword and lifecycle hooks (like pre('save')) to execute logic when interacting with the model.

// Why It's Important:

// Data and Behavior Together: Active Record combines the model’s data and behavior into one structure. This makes it easier to interact with the database directly from the model, keeping logic like password comparison inside the model itself.
// Consistency: Since models are reused across the app, all database interactions (e.g., user creation, password hashing) follow a consistent and standardized approach.
// Maintainability: When the schema needs to change, it's easy to update because everything related to that model (structure and methods) is in one place.
