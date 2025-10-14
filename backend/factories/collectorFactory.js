// factories/CollectorFactory.js
const Collector = require("../models/collector");

class CollectorFactory {
  static createCollector({ name, phone, email, password, city, center, usertype = "collector" }) {
    return new Collector({
      name,
      phone,
      email,
      password,
      usertype, // Allow for different types of users (future extensibility)
      city,
      center,
    });
  }
}

module.exports = CollectorFactory;

// Factory Pattern (collectorFactory.js)
// How it Works: The Factory Pattern is used to create objects without specifying the exact class of object that will be created. In your case, CollectorFactory is responsible for creating new instances of the Collector model based on the provided data.

// When a new collector is being registered (signupCollector function), the factory is invoked to create the Collector object with necessary attributes such as name, email, password, etc.
// Instead of manually creating a Collector instance in multiple places in the code, the factory centralizes this logic, making it easier to maintain and modify in the future.
// Why It's Important:

// Separation of concerns: The creation logic is separated from the business logic (controller), making your code more modular and easier to extend.
// Scalability: If you need to introduce different types of users (e.g., admin, collector, resident), you can easily modify the factory to handle these different types without changing the core logic in your controllers.
// Maintainability: If the logic to create a Collector object becomes more complex in the future, such as generating additional fields or applying business rules, you can keep that complexity isolated within the factory without affecting the rest of your application.
