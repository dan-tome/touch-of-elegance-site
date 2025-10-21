const servicesController = require('../../src/controllers/servicesController');

describe('Services Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
    };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('getAll', () => {
    it('should return all services with success status', () => {
      servicesController.getAll(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            description: expect.any(String),
            category: expect.any(String),
          }),
        ]),
      });
    });

    it('should return 6 services', () => {
      servicesController.getAll(req, res);

      const callArgs = res.json.mock.calls[0][0];
      expect(callArgs.data).toHaveLength(6);
    });

    it('should include expected service names', () => {
      servicesController.getAll(req, res);

      const callArgs = res.json.mock.calls[0][0];
      const serviceNames = callArgs.data.map(s => s.name);

      expect(serviceNames).toContain('Dry Cleaning');
      expect(serviceNames).toContain('Laundry Service');
      expect(serviceNames).toContain('Alterations');
      expect(serviceNames).toContain('Wedding Gown Care');
      expect(serviceNames).toContain('Leather & Suede');
      expect(serviceNames).toContain('Household Items');
    });
  });

  describe('getById', () => {
    it('should return a specific service when valid id is provided', () => {
      req.params.id = '1';

      servicesController.getById(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          id: 1,
          name: 'Dry Cleaning',
          description: expect.any(String),
          category: 'cleaning',
        }),
      });
    });

    it('should return 404 when service is not found', () => {
      req.params.id = '999';

      servicesController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Service not found',
      });
    });

    it('should handle string ids correctly', () => {
      req.params.id = '3';

      servicesController.getById(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          id: 3,
          name: 'Alterations',
        }),
      });
    });
  });
});
