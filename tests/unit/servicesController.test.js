const servicesController = require('../../src/controllers/servicesController');
const logger = require('../../src/utils/logger');

jest.mock('../../src/utils/logger');

describe('Services Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      params: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    logger.info = jest.fn();
    logger.error = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('should return all services successfully', () => {
      servicesController.getAll(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.any(Array),
      });
      expect(logger.info).toHaveBeenCalledWith('Fetching all services');
    });

    test('should return array of 6 services', () => {
      servicesController.getAll(mockReq, mockRes);

      const response = mockRes.json.mock.calls[0][0];
      expect(response.data).toHaveLength(6);
    });

    test('should return services with correct properties', () => {
      servicesController.getAll(mockReq, mockRes);

      const response = mockRes.json.mock.calls[0][0];
      const service = response.data[0];
      
      expect(service).toHaveProperty('id');
      expect(service).toHaveProperty('name');
      expect(service).toHaveProperty('description');
      expect(service).toHaveProperty('category');
    });

    test('should include specific services', () => {
      servicesController.getAll(mockReq, mockRes);

      const response = mockRes.json.mock.calls[0][0];
      const serviceNames = response.data.map(s => s.name);
      
      expect(serviceNames).toContain('Dry Cleaning');
      expect(serviceNames).toContain('Laundry Service');
      expect(serviceNames).toContain('Alterations');
      expect(serviceNames).toContain('Wedding Gown Care');
      expect(serviceNames).toContain('Leather & Suede');
      expect(serviceNames).toContain('Household Items');
    });
  });

  describe('getById', () => {
    test('should return service by valid id', () => {
      mockReq.params.id = '1';

      servicesController.getById(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          id: 1,
          name: 'Dry Cleaning',
        }),
      });
      expect(logger.info).toHaveBeenCalledWith('Fetching service with id: 1');
    });

    test('should return 404 for non-existent service', () => {
      mockReq.params.id = '999';

      servicesController.getById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Service not found',
      });
    });

    test('should handle different valid service ids', () => {
      const testIds = [1, 2, 3, 4, 5, 6];

      testIds.forEach(id => {
        mockReq.params.id = String(id);
        servicesController.getById(mockReq, mockRes);
        
        const response = mockRes.json.mock.calls[mockRes.json.mock.calls.length - 1][0];
        expect(response.success).toBe(true);
        expect(response.data.id).toBe(id);
      });
    });

    test('should parse string id to integer', () => {
      mockReq.params.id = '3';

      servicesController.getById(mockReq, mockRes);

      const response = mockRes.json.mock.calls[0][0];
      expect(response.data.id).toBe(3);
    });

    test('should handle invalid id format', () => {
      mockReq.params.id = 'invalid';

      servicesController.getById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Service not found',
      });
    });

    test('should return service with all required properties', () => {
      mockReq.params.id = '1';

      servicesController.getById(mockReq, mockRes);

      const response = mockRes.json.mock.calls[0][0];
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('name');
      expect(response.data).toHaveProperty('description');
      expect(response.data).toHaveProperty('category');
    });
  });

  describe('Service categories', () => {
    test('should include cleaning category services', () => {
      servicesController.getAll(mockReq, mockRes);

      const response = mockRes.json.mock.calls[0][0];
      const cleaningServices = response.data.filter(s => s.category === 'cleaning');
      
      expect(cleaningServices.length).toBeGreaterThan(0);
    });

    test('should include tailoring category services', () => {
      servicesController.getAll(mockReq, mockRes);

      const response = mockRes.json.mock.calls[0][0];
      const tailoringServices = response.data.filter(s => s.category === 'tailoring');
      
      expect(tailoringServices.length).toBeGreaterThan(0);
    });

    test('should include specialty category services', () => {
      servicesController.getAll(mockReq, mockRes);

      const response = mockRes.json.mock.calls[0][0];
      const specialtyServices = response.data.filter(s => s.category === 'specialty');
      
      expect(specialtyServices.length).toBeGreaterThan(0);
    });
  });

  describe('Error handling in getAll', () => {
    test('should catch and handle errors in getAll', () => {
      // Mock logger.info to throw, simulating an error during the request
      const originalInfo = logger.info;
      logger.info.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      servicesController.getAll(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(logger.error).toHaveBeenCalled();
      
      // Restore original
      logger.info = originalInfo;
    });
  });

  describe('Error handling in getById', () => {
    test('should handle errors in getById', () => {
      // Force an error by making find throw
      mockReq.params.id = '1';
      
      // Mock logger.info to throw an error
      logger.info.mockImplementation(() => {
        throw new Error('Logger error');
      });

      servicesController.getById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
