const Resident = require('../models/Resident');
// Add other user models if available in the future
// const Collector = require('../models/Collector');
// const Admin = require('../models/Admin');

class UserFactory {
  static createUser(type, userData) {
    switch (type) {
      case 'resident':
        return new Resident(userData);
      // If you have other user types, you can add them here
      // case 'collector':
      //   return new Collector(userData);
      // case 'admin':
      //   return new Admin(userData);
      default:
        throw new Error(`User type "${type}" is not recognized.`);
    }
  }
}

module.exports = UserFactory;
