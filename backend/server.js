const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const centerRoutes = require("./routes/centerRoutes");
const residentRoutes = require("./routes/residentRoutes");
const collectorRoutes = require("./routes/collectorRoutes");
const requestRoutes = require("./routes/wasteRequestRoutes");
const issueRoutes = require("./routes/issueRoutes");

const scheduleRoutes = require("./routes/scheduleRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const db = require("./db");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3050;

app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse incoming requests with JSON payloads

// Ensure database connection is established
db.connect()
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection failed", err);
    process.exit(1); // Exit process if the connection fails
  });

// Routes
// app.use("/api/auth", residentRoutes); // Resident Routes
app.use("/api/collector", collectorRoutes); // Collector Routes
app.use("/api/issues", issueRoutes); // Issue Routes
app.use("/api/requests", requestRoutes); // Waste Request Routes

app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/centers", centerRoutes); // Center routes

app.use("/api/schedule", scheduleRoutes); // Scheduling routes
app.use("/api/vehicles", vehicleRoutes);



// 404 error handling for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler for unexpected errors
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err);
  res.status(500).json({ message: "An unexpected error occurred" });
});

// Only start the server if it's not in a test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the app for testing
module.exports = app;
