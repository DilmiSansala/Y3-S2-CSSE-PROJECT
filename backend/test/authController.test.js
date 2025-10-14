// Importing necessary modules
const { signupResident, loginResident } = require('../controllers/authController');
const Resident = require('../models/Resident');
const UserFactory = require('../factories/UserFactory');
const jwt = require('jsonwebtoken');

// Mocking external dependencies
jest.mock('../models/Resident');
jest.mock('../factories/UserFactory');
jest.mock('jsonwebtoken');

describe('authController - signupResident', () => {
  
  // Positive Test Case: Resident signup success
  it('should create a new resident successfully', async () => {
    // Mock the factory to return a new resident object
    const mockResident = {
      save: jest.fn().mockResolvedValue({}),
    };

    UserFactory.createUser.mockReturnValue(mockResident);
    Resident.findOne.mockResolvedValue(null); // No existing resident with the email

    const req = {
      body: {
        residentName: "John Doe",
        address: "123 Main St",
        city: "Main City",
        phone: "1234567890",
        email: "johndoe@example.com",
        password: "password123",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await signupResident(req, res);

    expect(UserFactory.createUser).toHaveBeenCalledWith("resident", {
      residentName: "John Doe",
      address: "123 Main St",
      city: "Main City",
      phone: "1234567890",
      email: "johndoe@example.com",
      password: "password123",
      usertype: "resident",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "Resident registered successfully." });
  });

  // Negative Test Case: Email already in use
  it('should return 400 if email is already in use', async () => {
    Resident.findOne.mockResolvedValue({ email: "johndoe@example.com" }); // Mock existing resident

    const req = {
      body: {
        email: "johndoe@example.com",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await signupResident(req, res);

    expect(Resident.findOne).toHaveBeenCalledWith({ email: "johndoe@example.com" });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Email already in use." });
  });
});

describe('authController - loginResident', () => {
  
  // Positive Test Case: Login success with correct credentials
  it('should login a resident successfully with correct credentials', async () => {
    const mockResident = {
      comparePassword: jest.fn().mockResolvedValue(true), // Correct password
      _id: "123",
      residentName: "John Doe",
      email: "johndoe@example.com",
      address: "123 Main St",
      phone: "1234567890",
      usertype: "resident",
    };

    Resident.findOne.mockResolvedValue(mockResident);
    jwt.sign.mockReturnValue("mockToken"); // Mock JWT token generation

    const req = {
      body: {
        email: "johndoe@example.com",
        password: "password123",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await loginResident(req, res);

    expect(Resident.findOne).toHaveBeenCalledWith({ email: "johndoe@example.com" });
    expect(mockResident.comparePassword).toHaveBeenCalledWith("password123");
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockResident._id, usertype: mockResident.usertype },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: "mockToken",
      residentName: "John Doe",
      email: "johndoe@example.com",
      address: "123 Main St",
      phone: "1234567890",
      usertype: "resident",
    });
  });

  // Negative Test Case: Invalid email or password
  it('should return 400 if credentials are incorrect', async () => {
    const mockResident = {
      comparePassword: jest.fn().mockResolvedValue(false), // Incorrect password
    };

    Resident.findOne.mockResolvedValue(mockResident);

    const req = {
      body: {
        email: "johndoe@example.com",
        password: "wrongpassword",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await loginResident(req, res);

    expect(Resident.findOne).toHaveBeenCalledWith({ email: "johndoe@example.com" });
    expect(mockResident.comparePassword).toHaveBeenCalledWith("wrongpassword");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid email or password." });
  });
});
