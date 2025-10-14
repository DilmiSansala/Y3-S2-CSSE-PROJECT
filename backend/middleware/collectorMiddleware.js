const jwt = require("jsonwebtoken");
const Collector = require("../models/collector");

exports.protectCollector = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract the token
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the collector by ID and attach to request object (without password)
      req.user = await Collector.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found." });
      }

      next(); // Proceed to the next middleware or controller
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token verification failed." });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided." });
  }
};

// Applied Pattern: Middleware Design Pattern
// How it Works:

// The Middleware Pattern in Express allows you to apply functionality (like authentication, logging, etc.) to requests before they reach the controller. In your project, you’ve applied middleware with JWT authentication in collectorMiddleware.js using protectCollector.

// Why It's Important:

// Separation of Concerns: Middleware separates authentication, validation, and other pre-processing logic from the core request handling. This keeps controllers focused on business logic and response handling.
// Reusability: Middleware can be applied to any route (or group of routes), making it reusable across multiple endpoints.
// Modularity: You can add different middlewares for various tasks (logging, validation, etc.) without changing controller logic, ensuring modular and maintainable code.
