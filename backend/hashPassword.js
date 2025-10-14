const bcrypt = require("bcrypt");

async function hashPassword(plainTextPassword) {
  const salt = await bcrypt.genSalt(10); // Generate salt
  const hashedPassword = await bcrypt.hash(plainTextPassword, salt); // Hash password
  console.log("Hashed Password:", hashedPassword);
}

hashPassword("admin123"); // Replace 'admin123' with the password you want
