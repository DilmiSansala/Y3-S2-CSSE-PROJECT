const Resident = require("../models/Resident");

class UserFactory {
  static createUser(type, userData) {
    switch (type) {
      case "resident":
        return new Resident(userData);
      default:
        throw new Error(`User type "${type}" is not recognized.`);
    }
  }
}

module.exports = UserFactory;
