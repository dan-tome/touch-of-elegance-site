const customersController = require('../../src/controllers/customersController');

describe('Customers Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
    };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('getAll', () => {
    it('should return all customers with success status', () => {
      customersController.getAll(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.any(Array),
      });
    });

    it('should return an array of customers', () => {
      customersController.getAll(req, res);

      const callArgs = res.json.mock.calls[0][0];
      expect(Array.isArray(callArgs.data)).toBe(true);
    });

    it('should return customers with correct structure', () => {
      customersController.create({
        body: {
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '555-1234',
        },
      }, res);

      customersController.getAll(req, res);

      const callArgs = res.json.mock.calls[1][0];
      if (callArgs.data.length > 0) {
        expect(callArgs.data[0]).toMatchObject({
          id: expect.any(Number),
          firstName: expect.any(String),
          lastName: expect.any(String),
          phoneNumber: expect.any(String),
          createdAt: expect.any(String),
        });
      }
    });
  });

  describe('getById', () => {
    it('should return a specific customer when valid id is provided', () => {
      customersController.create({
        body: {
          firstName: 'Jane',
          lastName: 'Smith',
          phoneNumber: '555-5678',
        },
      }, res);

      const createCallArgs = res.json.mock.calls[0][0];
      const customerId = createCallArgs.data.id;

      req.params.id = customerId.toString();
      customersController.getById(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          id: customerId,
          firstName: 'Jane',
          lastName: 'Smith',
          phoneNumber: '555-5678',
        }),
      });
    });

    it('should return 404 when customer is not found', () => {
      req.params.id = '99999';

      customersController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Customer not found',
      });
    });
  });

  describe('create', () => {
    it('should create a new customer with valid data', () => {
      req.body = {
        firstName: 'Alice',
        lastName: 'Johnson',
        phoneNumber: '555-9876',
      };

      customersController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Customer created successfully',
        data: expect.objectContaining({
          id: expect.any(Number),
          firstName: 'Alice',
          lastName: 'Johnson',
          phoneNumber: '555-9876',
          createdAt: expect.any(String),
        }),
      });
    });

    it('should return 400 when firstName is missing', () => {
      req.body = {
        lastName: 'Johnson',
        phoneNumber: '555-9876',
      };

      customersController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'First name is required',
      });
    });

    it('should return 400 when lastName is missing', () => {
      req.body = {
        firstName: 'Alice',
        phoneNumber: '555-9876',
      };

      customersController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Last name is required',
      });
    });

    it('should return 400 when phoneNumber is missing', () => {
      req.body = {
        firstName: 'Alice',
        lastName: 'Johnson',
      };

      customersController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Phone number is required',
      });
    });

    it('should trim whitespace from inputs', () => {
      req.body = {
        firstName: '  Alice  ',
        lastName: '  Johnson  ',
        phoneNumber: '  555-9876  ',
      };

      customersController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      const callArgs = res.json.mock.calls[0][0];
      expect(callArgs.data.firstName).toBe('Alice');
      expect(callArgs.data.lastName).toBe('Johnson');
      expect(callArgs.data.phoneNumber).toBe('555-9876');
    });
  });
});
