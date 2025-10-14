const jwt = require("jsonwebtoken");

class JwtService {
  static generateToken(payload, expiresIn = "1h") {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}

module.exports = JwtService;



// Applied Pattern: Service Pattern (JWT Service)
// How it Works:

// You can apply the Service Pattern to manage tasks like JWT token generation and validation separately. Right now, in your controller, you are directly generating JWT tokens (e.g., in signInCollector). A better approach would be to extract JWT handling into a dedicated service that handles token generation, verification, and expiration checks.
// Why It's Important:

// Separation of Concerns: Extracting JWT logic into its own service keeps the controller focused on business logic. If you need to change the JWT logic (e.g., changing expiration time, adding claims), you can do so in the JWT service without touching the controller.
// Reusability: A dedicated JWT service can be used across different controllers, ensuring that the same token management logic is applied uniformly throughout the app.
// Security: Keeping token handling in a single service centralizes security-critical code, making it easier to audit and maintain.