const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

class Database {
  constructor() {
    if (!Database.instance) {
      this.connection = null;
      Database.instance = this;
    }
    return Database.instance;
  }

  async connect() {
    if (!this.connection) {
      const uri = process.env.MONGODB_URL || 'mongodb+srv://dilmi:12345@dilmi.3dafe9g.mongodb.net/';

      if (!uri) {
        console.error("MONGODB_URL is not defined in the environment variables.");
        process.exit(1);
      }

      console.log("Attempting to connect to the database...");

      try {
        // Connect without deprecated options
        await mongoose.connect(uri);
        console.log("MongoDB connected");

        this.connection = mongoose.connection;

        // Listen for connection events
        mongoose.connection.on("connected", () => {
          console.log("Mongoose connected to DB.");
        });

        mongoose.connection.on("error", (err) => {
          console.error(`Mongoose connection error: ${err}`);
        });

        mongoose.connection.on("disconnected", () => {
          console.log("Mongoose disconnected.");
        });

        return true; // Connection successful
      } catch (err) {
        console.error("Connection error:", err);
        return false; // Connection failed
      }
    }

    return this.connection;
  }
}

// Export a singleton instance of the Database class
module.exports = new Database();

// Singleton Pattern (db.js)
// How it Works: The Singleton Pattern ensures that a class has only one instance throughout the lifecycle of the application. In the db.js file, the Database class uses the Singleton pattern to make sure that only one connection to MongoDB is established. If any part of your application tries to connect to the database, the same connection is reused.
// This is achieved by checking whether an instance of the Database class already exists. If it doesn't, a new connection is created. If it does, the existing connection is returned.
// Why It's Important:
// Efficiency: Creating multiple database connections can lead to performance issues, and the Singleton pattern ensures that the same connection is reused, saving system resources.
// Consistency: Ensures that the application always interacts with the same database instance, which reduces bugs and inconsistencies in data handling.
// Centralized Management: With only one instance of the database connection, it’s easier to manage and debug connection-related issues.
