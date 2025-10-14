const UserFactory = require("../factories/UserFactory");
const Resident = require("../models/Resident"); // Make sure Resident is imported directly
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Signup resident (using the factory pattern)
exports.signupResident = async (req, res) => {
  try {
    const { residentName, address, city, phone, email, password } = req.body;

    // Check if the email is already used
    const existingResident = await Resident.findOne({ email });
    if (existingResident) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Create a new resident using the factory
    const newResident = UserFactory.createUser("resident", {
      residentName,
      address,
      city,
      phone,
      email,
      password,
      usertype: "resident"
    });

    await newResident.save();
    res.status(201).json({ message: "Resident registered successfully." });
  } catch (error) {
    console.error("Error registering resident:", error); // Add a console log for debugging
    res.status(500).json({ message: "Error registering resident.", error });
  }
};

// Login resident
exports.loginResident = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the resident by email
    const resident = await Resident.findOne({ email });
    if (!resident) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare the password
    const isMatch = await resident.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: resident._id, usertype: resident.usertype },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      residentName: resident.residentName,
      email: resident.email,
      address: resident.address,
      phone: resident.phone,
      usertype: resident.usertype
    });
  } catch (error) {
    console.error("Error logging in resident:", error); // Add a console log for debugging
    res.status(500).json({ message: "Error logging in resident.", error });
  }
};

// Login admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Searching for admin:", {
      email: email.toLowerCase(),
      usertype: "admin"
    });
    // Ensure the email is compared in lowercase
    const admin = await Resident.findOne({
      email: email.toLowerCase(),
      usertype: "admin"
    });

    if (!admin) {
      console.log("Admin not found");
      return res.status(400).json({ message: "Invalid email or password." });
    }
    console.log("Admin found:", admin);

    // Compare the hashed password with the plain text password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, usertype: admin.usertype },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      adminName: admin.residentName,
      email: admin.email,
      usertype: admin.usertype
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in admin.", error });
  }
};
