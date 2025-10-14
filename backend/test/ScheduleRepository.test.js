const CollectorRepository = require('../repositories/collectorRepository');
const Collector = require('../models/Collector');

// Mock Mongoose methods
jest.mock('../models/Collector', () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  prototype: {
    save: jest.fn(),
  },
}));

describe('CollectorRepository Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  

  describe('findByEmail', () => {
    it('should return a collector by email', async () => {
      const mockCollector = { name: 'John Doe', email: 'john@example.com' };
      Collector.findOne.mockResolvedValue(mockCollector);

      const result = await CollectorRepository.findByEmail('john@example.com');

      expect(Collector.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(result).toEqual(mockCollector);
    });
  });

 

  describe('findAll', () => {
    it('should return all collectors', async () => {
      const mockCollectors = [
        { _id: '1', name: 'John Doe', email: 'john@example.com' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      ];
      Collector.find.mockResolvedValue(mockCollectors);

      const result = await CollectorRepository.findAll();

      expect(Collector.find).toHaveBeenCalled();
      expect(result).toEqual(mockCollectors);
    });
  });

  describe('updateById', () => {
    it('should update a collector by id', async () => {
      const mockUpdatedCollector = { _id: '123', name: 'John Updated', email: 'john@example.com' };
      Collector.findByIdAndUpdate.mockResolvedValue(mockUpdatedCollector);

      const result = await CollectorRepository.updateById('123', { name: 'John Updated' });

      expect(Collector.findByIdAndUpdate).toHaveBeenCalledWith('123', { name: 'John Updated' }, { new: true });
      expect(result).toEqual(mockUpdatedCollector);
    });
  });
});
