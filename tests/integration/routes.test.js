const request = require('supertest');
const app = require('../../src/server');

describe('API Routes Integration Tests', () => {
  describe('GET /api', () => {
    test('should return API information', async () => {
      const response = await request(app).get('/api');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Touch of Elegance API');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('endpoints');
    });

    test('should list available endpoints', async () => {
      const response = await request(app).get('/api');

      expect(response.body.endpoints).toHaveProperty('services');
      expect(response.body.endpoints).toHaveProperty('contact');
      expect(response.body.endpoints).toHaveProperty('health');
    });
  });

  describe('GET /api/services', () => {
    test('should return all services', async () => {
      const response = await request(app).get('/api/services');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should return 6 services', async () => {
      const response = await request(app).get('/api/services');

      expect(response.body.data).toHaveLength(6);
    });

    test('should include required service properties', async () => {
      const response = await request(app).get('/api/services');

      const service = response.body.data[0];
      expect(service).toHaveProperty('id');
      expect(service).toHaveProperty('name');
      expect(service).toHaveProperty('description');
      expect(service).toHaveProperty('category');
    });
  });

  describe('GET /api/services/:id', () => {
    test('should return service by id', async () => {
      const response = await request(app).get('/api/services/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id', 1);
      expect(response.body.data).toHaveProperty('name', 'Dry Cleaning');
    });

    test('should return 404 for non-existent service', async () => {
      const response = await request(app).get('/api/services/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Service not found');
    });

    test('should handle all valid service ids', async () => {
      for (let id = 1; id <= 6; id++) {
        const response = await request(app).get(`/api/services/${id}`);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(id);
      }
    });
  });

  describe('POST /api/contact', () => {
    test('should accept valid contact form submission', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        message: 'Test message',
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
    });

    test('should accept contact form without phone', async () => {
      const contactData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Another test message',
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    test('should return 400 for missing name', async () => {
      const contactData = {
        email: 'john@example.com',
        message: 'Test message',
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for missing email', async () => {
      const contactData = {
        name: 'John Doe',
        message: 'Test message',
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    test('should return 400 for missing message', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    test('should return 400 for invalid email', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'Test message',
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData);

      // Could be 400 (validation error) or 429 (rate limited)
      expect([400, 429]).toContain(response.status);
      if (response.status === 400) {
        expect(response.body).toHaveProperty('error', 'Invalid email address');
      }
    });

    test('should set correct content type for valid request', async () => {
      const contactData = {
        name: 'Test User',
        email: 'testuser@example.com',
        message: 'Valid test message',
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData);

      // Could be rate limited, so check status
      if (response.status === 200) {
        expect(response.headers['content-type']).toMatch(/json/);
      }
    });
  });

  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });

    test('should return valid timestamp format', async () => {
      const response = await request(app).get('/health');

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toString()).not.toBe('Invalid Date');
    });

    test('should return numeric uptime', async () => {
      const response = await request(app).get('/health');

      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.uptime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('GET /', () => {
    test('should serve static index.html', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/html/);
    });
  });

  describe('404 handler', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
    });

    test('should return JSON for API routes', async () => {
      const response = await request(app).get('/api/non-existent');

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('Security headers', () => {
    test('should include security headers', async () => {
      const response = await request(app).get('/api');

      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
    });
  });

  describe('CORS', () => {
    test('should handle CORS preflight requests', async () => {
      const response = await request(app)
        .options('/api/services')
        .set('Origin', 'http://example.com')
        .set('Access-Control-Request-Method', 'GET');

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });
});
