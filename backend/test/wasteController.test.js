const { createWasteRequest } = require('../controllers/wasteController');
const WasteRequest = require('../models/WasteRequest');
const CollectionCenter = require('../models/Center');

// Import the actual mongoose but mock specific parts
const mongoose = require('mongoose');

// Mocking external dependencies
jest.mock('../models/WasteRequest');
jest.mock('../models/Center');

// Mocking only specific parts of mongoose
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose'); // Load the actual mongoose module
  return {
    ...actualMongoose,
    connection: {
      readyState: 1, // Simulate connected state for the successful case
    },
  };
});

describe('wasteController - createWasteRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  // Positive Test Case: Successfully create a waste request
  it('should create a new waste request successfully with valid data', async () => {
    const mockCenter = { _id: 'validCenterId', name: 'Main Center', location: 'Main City' };
    const mockWasteRequest = {
      save: jest.fn().mockResolvedValue({}),
    };

    // Mock valid collection center and waste request creation
    CollectionCenter.findById.mockResolvedValue(mockCenter);
    WasteRequest.mockImplementation(() => mockWasteRequest); // Mock WasteRequest constructor

    const req = {
      body: {
        wasteType: 'Plastic',
        quantity: 10,
        collectionDate: '2024-10-20',
        collectionTime: '10:00',
        collectionCenter: 'validCenterId',
      },
      user: { id: 'userId' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createWasteRequest(req, res);

    // Expectations
    expect(CollectionCenter.findById).toHaveBeenCalledWith('validCenterId');
    expect(WasteRequest).toHaveBeenCalledWith({
      resident: 'userId',
      wasteType: 'Plastic',
      quantity: 10,
      collectionDate: '2024-10-20',
      collectionTime: '10:00',
      collectionCenter: 'validCenterId',
    });
    expect(mockWasteRequest.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Waste request created successfully.' });
  });

  // Negative Test Case: Invalid collection center
  it('should return 400 if collection center is invalid', async () => {
    // Mock invalid collection center
    CollectionCenter.findById.mockResolvedValue(null); // Invalid center

    const req = {
      body: {
        wasteType: 'Plastic',
        quantity: 10,
        collectionDate: '2024-10-20',
        collectionTime: '10:00',
        collectionCenter: 'invalidCenterId',
      },
      user: { id: 'userId' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createWasteRequest(req, res);

    // Expectations
    expect(CollectionCenter.findById).toHaveBeenCalledWith('invalidCenterId');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid collection center selected.' });
  });

  // Negative Test Case: Missing required fields
  it('should return 400 if required fields are missing', async () => {
    const req = {
      body: {
        wasteType: 'Plastic',
        quantity: 10,
        collectionDate: '', // Missing collection date
        collectionTime: '10:00',
        collectionCenter: 'validCenterId',
      },
      user: { id: 'userId' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createWasteRequest(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required, including collection center.' });
  });

  // Negative Test Case: Simulate server error
  it('should return 500 if there is a server error', async () => {
    // Mock a database error while fetching the collection center
    CollectionCenter.findById.mockRejectedValue(new Error('Server error'));

    const req = {
      body: {
        wasteType: 'Plastic',
        quantity: 10,
        collectionDate: '2024-10-20',
        collectionTime: '10:00',
        collectionCenter: 'validCenterId',
      },
      user: { id: 'userId' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createWasteRequest(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error creating waste request.',
      error: expect.any(Error),
    });
  });
});
