const CollectorFactory = require("../factories/collectorFactory");
const jwt = require("jsonwebtoken");
const CollectorRepository = require("../repositories/collectorRepository");
const { ExperiencedCollectorStrategy, NewCollectorStrategy } = require("../strategies/collectorProfileStrategy");

// Signup collector
exports.signupCollector = async (req, res) => {
  try {
    const { name, phone, email, password, city, center } = req.body;

    // Check if the email already exists
    const existingCollector = await CollectorRepository.findByEmail(email);
    if (existingCollector) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Create the collector data (this is not saved yet)
    const newCollectorData = CollectorFactory.createCollector({
      name,
      phone,
      email,
      password,
      city,
      center,
    });

    // Save the new collector using repository
    const savedCollector = await CollectorRepository.create(newCollectorData);

    res.status(201).json({ message: "Collector registered successfully.", collector: savedCollector });
  } catch (error) {
    console.error("Error registering collector:", error);
    res.status(500).json({ message: "Error registering collector.", error });
  }
};

// Signin collector
exports.signInCollector = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the collector by email
    const collector = await CollectorRepository.findByEmail(email);
    if (!collector) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare the password
    const isMatch = await collector.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: collector._id, usertype: collector.usertype }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      token,
      name: collector.name,
      email: collector.email,
      phone: collector.phone,
      usertype: collector.usertype,
      city: collector.city,
      center: collector.center,
    });
  } catch (error) {
    console.error("Error logging in collector:", error);
    res.status(500).json({ message: "Error logging in collector.", error });
  }
};

// Get collector profile (Read operation)
exports.getProfile = async (req, res) => {
  try {
    const collector = await CollectorRepository.findById(req.user.id);
    if (!collector) {
      return res.status(404).json({ message: "Collector not found." });
    }
    res.status(200).json(collector);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile.", error });
  }
};

// Update collector profile (Update operation)
exports.updateProfile = async (req, res) => {
  const { name, email, phone, address } = req.body;

  try {
    const collector = await CollectorRepository.findById(req.user.id);

    if (!collector) {
      return res.status(404).json({ message: "Collector not found." });
    }

    // Update fields
    if (name) collector.name = name;
    if (email) collector.email = email;
    if (phone) collector.phone = phone;
    if (address) collector.address = address;

    const updatedCollector = await collector.save();

    res.status(200).json({ message: "Profile updated successfully.", collector: updatedCollector });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile.", error });
  }
};

// Get all collectors (workers)
exports.getAllCollectors = async (req, res) => {
  try {
    const collectors = await CollectorRepository.findAll(); // Fetch all collectors from the database
    res.status(200).json(collectors);
  } catch (error) {
    console.error("Error fetching collectors:", error);
    res.status(500).json({ message: "Error fetching collectors.", error });
  }
};

// Get collector info using strategy
exports.getCollectorInfo = async (req, res) => {
  try {
    const collector = await CollectorRepository.findById(req.user.id);

    if (!collector) {
      return res.status(404).json({ message: "Collector not found." });
    }

    let strategy;
    if (collector.isExperienced) {
      strategy = new ExperiencedCollectorStrategy();
    } else {
      strategy = new NewCollectorStrategy();
    }

    const profileMessage = strategy.apply(collector);
    res.status(200).json({ message: profileMessage });
  } catch (error) {
    console.error("Error fetching collector info:", error);
    res.status(500).json({ message: "Error fetching collector info.", error });
  }
};

// Controller Pattern
// How it Works:
// Controllers act as intermediaries between the client and the data layer. They handle incoming HTTP requests, process them, and return the appropriate responses. The controller coordinates the flow of data between the view (frontend) and the model (backend).
// Each function in the controller performs a specific task (e.g., signing up a collector, logging in, updating profiles) by interacting with the appropriate services or repositories.
// Why It’s Important:
// Separation of Concerns: The controller pattern separates concerns by ensuring that each part of the code has a single responsibility. Controllers focus on handling HTTP requests and responses, while repositories or services handle the business logic and data access.
// Reusability: By keeping the controller logic clean and concise, you can easily reuse the same logic in different parts of your application, especially when implementing RESTful APIs.
// Maintainability: The controller pattern makes the code more maintainable. If you need to change the way the app processes a specific request, you only need to update the corresponding controller function, not the whole system.
