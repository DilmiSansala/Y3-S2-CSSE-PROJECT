const { getAllCollectionCenters } = require('../controllers/collectionCenterController');
const CollectionCenter = require('../models/Center');

// Mocking external dependencies
jest.mock('../models/Center');

describe('centerController - getAllCollectionCenters', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  // Positive Test Case: Successfully fetch all collection centers
  it('should return all collection centers successfully', async () => {
    const mockCenters = [
      { _id: 'center1', name: 'Center 1', location: 'Location 1' },
      { _id: 'center2', name: 'Center 2', location: 'Location 2' },
    ];

    // Mock successful center fetching
    CollectionCenter.find.mockResolvedValue(mockCenters);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllCollectionCenters(req, res);

    // Expectations
    expect(CollectionCenter.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCenters);
  });

  // Negative Test Case: Simulate server error
  it('should return 500 if there is a server error', async () => {
    // Mock a server error
    CollectionCenter.find.mockRejectedValue(new Error('Server error'));

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllCollectionCenters(req, res);

    // Expectations
    expect(CollectionCenter.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching collection centers' });
  });
});
