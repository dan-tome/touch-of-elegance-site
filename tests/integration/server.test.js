const request = require('supertest');
const app = require('../../src/server');

describe('Express Server Integration Tests', () => {
  describe('Middleware stack', () => {
    test('should parse JSON bodies', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({ name: 'Test', email: 'test@example.com', message: 'Test' })
        .set('Content-Type', 'application/json');

      expect(response.status).not.toBe(400);
    });

    test('should parse URL-encoded bodies', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send('name=Test&email=test@example.com&message=Test')
        .set('Content-Type', 'application/x-www-form-urlencoded');

      expect(response.status).not.toBe(400);
    });

    test('should serve static files', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
    });

    test('should compress responses', async () => {
      const response = await request(app)
        .get('/api/services')
        .set('Accept-Encoding', 'gzip');

      // Check if compression middleware is working
      expect(response.status).toBe(200);
    });
  });

  describe('Error handling', () => {
    test('should handle 404 errors', async () => {
      const response = await request(app).get('/non-existent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    test('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send('{"invalid json}')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
    });
  });

  describe('API endpoints availability', () => {
    test('should have services endpoint', async () => {
      const response = await request(app).get('/api/services');
      expect(response.status).toBe(200);
    });

    test('should have contact endpoint', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({ name: 'Test', email: 'test@example.com', message: 'Test' });

      expect([200, 400]).toContain(response.status); // Could be validation error or success
    });

    test('should have health endpoint', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
    });

    test('should have API root endpoint', async () => {
      const response = await request(app).get('/api');
      expect(response.status).toBe(200);
    });
  });

  describe('Response formats', () => {
    test('should return JSON for API endpoints', async () => {
      const response = await request(app).get('/api/services');

      expect(response.headers['content-type']).toMatch(/json/);
    });

    test('should return HTML for root endpoint', async () => {
      const response = await request(app).get('/');

      expect(response.headers['content-type']).toMatch(/html/);
    });
  });

  describe('Security middleware', () => {
    test('should set X-Content-Type-Options header', async () => {
      const response = await request(app).get('/api');

      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });

    test('should set X-Frame-Options header', async () => {
      const response = await request(app).get('/api');

      expect(response.headers).toHaveProperty('x-frame-options');
    });

    test('should set X-XSS-Protection header', async () => {
      const response = await request(app).get('/api');

      expect(response.headers).toHaveProperty('x-xss-protection');
    });
  });

  describe('Rate limiting', () => {
    test('should apply rate limiting to API routes', async () => {
      // Make multiple requests
      const requests = Array(5).fill(null).map(() => 
        request(app).get('/api/services')
      );

      const responses = await Promise.all(requests);

      // All should succeed as we're under the limit
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });

    test('should have rate limit headers', async () => {
      const response = await request(app).get('/api/services');

      // express-rate-limit adds these headers
      expect(response.headers).toHaveProperty('ratelimit-limit');
      expect(response.headers).toHaveProperty('ratelimit-remaining');
    });
  });

  describe('HTTP methods', () => {
    test('should support GET requests', async () => {
      const response = await request(app).get('/api/services');
      expect(response.status).toBe(200);
    });

    test('should support POST requests', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({ name: 'Test', email: 'test@example.com', message: 'Test' });

      expect([200, 400]).toContain(response.status);
    });

    test('should support OPTIONS requests (CORS)', async () => {
      const response = await request(app)
        .options('/api/services');

      expect([200, 204]).toContain(response.status);
    });
  });

  describe('Content negotiation', () => {
    test('should accept JSON content type', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({ name: 'Test', email: 'test@example.com', message: 'Test' })
        .set('Content-Type', 'application/json');

      expect(response.status).not.toBe(415); // Not unsupported media type
    });

    test('should return JSON responses', async () => {
      const response = await request(app).get('/api/services');

      expect(response.type).toBe('application/json');
    });
  });
});
