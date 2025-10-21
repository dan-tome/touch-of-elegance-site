const request = require('supertest');
const app = require('../../src/server');

describe('Customers API Integration Tests', () => {
  describe('POST /api/customers', () => {
    it('should create a new customer with valid data', async () => {
      const newCustomer = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '555-1234',
      };

      const response = await request(app)
        .post('/api/customers')
        .send(newCustomer);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Customer created successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toMatchObject({
        id: expect.any(Number),
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '555-1234',
        createdAt: expect.any(String),
      });
    });

    it('should return 400 when firstName is missing', async () => {
      const invalidCustomer = {
        lastName: 'Doe',
        phoneNumber: '555-1234',
      };

      const response = await request(app)
        .post('/api/customers')
        .send(invalidCustomer);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'First name is required');
    });

    it('should return 400 when lastName is missing', async () => {
      const invalidCustomer = {
        firstName: 'John',
        phoneNumber: '555-1234',
      };

      const response = await request(app)
        .post('/api/customers')
        .send(invalidCustomer);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Last name is required');
    });

    it('should return 400 when phoneNumber is missing', async () => {
      const invalidCustomer = {
        firstName: 'John',
        lastName: 'Doe',
      };

      const response = await request(app)
        .post('/api/customers')
        .send(invalidCustomer);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Phone number is required');
    });
  });

  describe('GET /api/customers', () => {
    it('should return all customers', async () => {
      // Create a customer first
      await request(app)
        .post('/api/customers')
        .send({
          firstName: 'Jane',
          lastName: 'Smith',
          phoneNumber: '555-5678',
        });

      const response = await request(app).get('/api/customers');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);

      // Check customer structure
      const customer = response.body.data[0];
      expect(customer).toHaveProperty('id');
      expect(customer).toHaveProperty('firstName');
      expect(customer).toHaveProperty('lastName');
      expect(customer).toHaveProperty('phoneNumber');
      expect(customer).toHaveProperty('createdAt');
    });
  });

  describe('GET /api/customers/:id', () => {
    it('should return a specific customer', async () => {
      // Create a customer first
      const createResponse = await request(app)
        .post('/api/customers')
        .send({
          firstName: 'Alice',
          lastName: 'Johnson',
          phoneNumber: '555-9876',
        });

      const customerId = createResponse.body.data.id;

      const response = await request(app).get(`/api/customers/${customerId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toMatchObject({
        id: customerId,
        firstName: 'Alice',
        lastName: 'Johnson',
        phoneNumber: '555-9876',
      });
    });

    it('should return 404 for non-existent customer', async () => {
      const response = await request(app).get('/api/customers/99999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Customer not found');
    });
  });
});
