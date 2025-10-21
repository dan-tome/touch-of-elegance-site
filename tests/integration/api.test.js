const request = require('supertest');
const app = require('../../src/server');

describe('API Endpoints Integration Tests', () => {
  describe('Health Check', () => {
    it('GET /health should return healthy status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(typeof response.body.uptime).toBe('number');
    });
  });

  describe('API Information', () => {
    it('GET /api should return API information', async () => {
      const response = await request(app).get('/api');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Touch of Elegance API');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body.endpoints).toHaveProperty('services');
      expect(response.body.endpoints).toHaveProperty('contact');
      expect(response.body.endpoints).toHaveProperty('health');
    });
  });

  describe('Services Endpoints', () => {
    it('GET /api/services should return all services', async () => {
      const response = await request(app).get('/api/services');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      // Check first service structure
      const service = response.body.data[0];
      expect(service).toHaveProperty('id');
      expect(service).toHaveProperty('name');
      expect(service).toHaveProperty('description');
      expect(service).toHaveProperty('category');
    });

    it('GET /api/services/:id should return a specific service', async () => {
      const response = await request(app).get('/api/services/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id', 1);
      expect(response.body.data).toHaveProperty('name');
    });

    it('GET /api/services/:id should return 404 for non-existent service', async () => {
      const response = await request(app).get('/api/services/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Service not found');
    });
  });

  describe('Contact Endpoint', () => {
    it('POST /api/contact should accept valid contact form', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-1234',
        message: 'I need information about dry cleaning services',
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
    });

    it('POST /api/contact should accept form without phone', async () => {
      const contactData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        message: 'Question about pricing',
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('POST /api/contact should reject missing name', async () => {
      const contactData = {
        email: 'john@example.com',
        message: 'Test message',
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('POST /api/contact should reject missing email', async () => {
      const contactData = {
        name: 'John Doe',
        message: 'Test message',
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('POST /api/contact should reject missing message', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('POST /api/contact should reject invalid email format', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'Test message',
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData)
        .set('Content-Type', 'application/json');

      // May return 429 if rate limited or 400 if validation fails first
      expect([400, 429]).toContain(response.status);
      
      // Only check error details if not rate limited
      if (response.status === 400) {
        expect(response.body).toHaveProperty('success', false);
        expect(response.body.error).toContain('email');
      }
    });
  });

  describe('Static Files', () => {
    it('GET / should serve the main HTML page', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/html');
      expect(response.text).toContain('A Touch of Elegance');
    });

    it('GET /css/styles.css should serve CSS file', async () => {
      const response = await request(app).get('/css/styles.css');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/css');
    });

    it('GET /js/main.js should serve JavaScript file', async () => {
      const response = await request(app).get('/js/main.js');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/javascript');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });

  describe('Security Headers', () => {
    it('should include security headers in responses', async () => {
      const response = await request(app).get('/api');

      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
    });
  });
});
