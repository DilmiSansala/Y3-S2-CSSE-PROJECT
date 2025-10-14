// repositories/CollectorRepository.js
const Collector = require("../models/collector");

class CollectorRepository {
  async create(collectorData) {
    const collector = new Collector(collectorData);
    return collector.save();
  }

  async findByEmail(email) {
    return Collector.findOne({ email });
  }

  async findById(id) {
    return Collector.findById(id).select("-password");
  }

  async findAll() {
    return Collector.find();
  }

  async updateById(id, updateData) {
    return Collector.findByIdAndUpdate(id, updateData, { new: true });
  }
}

module.exports = new CollectorRepository();



// Repository Pattern (collectorRepository.js)
// How it Works: The Repository Pattern abstracts the data access logic and provides a centralized location for database queries. Instead of having the controllers directly interact with the Collector model, the repository handles all database operations.
// In your controllers, instead of calling Collector.findOne() or Collector.save() directly, you use methods from CollectorRepository like findByEmail() and create(). This means that the controllers don’t need to know how the data is stored or retrieved, they only care about calling the correct repository methods.
// Why It's Important:
// Decoupling: It decouples the business logic (controller) from the database access logic. If you later decide to switch databases or change the way data is stored, you only need to update the repository, not the controllers.
// Testability: Since all data access is centralized in the repository, it becomes easier to mock these methods in tests, which simplifies unit testing for the controllers.
// Consistency: By using a repository, you can ensure that the same methods are used across the application for interacting with the database, leading to more consistent and maintainable code.