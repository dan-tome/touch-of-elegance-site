const contactController = require('../../src/controllers/contactController');

describe('Contact Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('submit', () => {
    it('should successfully process a valid contact form', () => {
      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-1234',
        message: 'I need dry cleaning service',
      };

      contactController.submit(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Your message has been received. We will contact you soon!',
      });
    });

    it('should accept contact form without phone number', () => {
      req.body = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        message: 'Question about services',
      };

      contactController.submit(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: expect.any(String),
      });
    });

    it('should return 400 when name is missing', () => {
      req.body = {
        email: 'john@example.com',
        message: 'Test message',
      };

      contactController.submit(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Name, email, and message are required',
      });
    });

    it('should return 400 when email is missing', () => {
      req.body = {
        name: 'John Doe',
        message: 'Test message',
      };

      contactController.submit(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Name, email, and message are required',
      });
    });

    it('should return 400 when message is missing', () => {
      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      contactController.submit(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Name, email, and message are required',
      });
    });

    it('should return 400 for invalid email format', () => {
      req.body = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'Test message',
      };

      contactController.submit(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid email address',
      });
    });

    it('should reject email without domain', () => {
      req.body = {
        name: 'John Doe',
        email: 'john@',
        message: 'Test message',
      };

      contactController.submit(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid email address',
      });
    });

    it('should reject email without @ symbol', () => {
      req.body = {
        name: 'John Doe',
        email: 'johnexample.com',
        message: 'Test message',
      };

      contactController.submit(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid email address',
      });
    });

    it('should accept valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'test123@test-domain.com',
      ];

      validEmails.forEach(email => {
        req.body = {
          name: 'John Doe',
          email: email,
          message: 'Test message',
        };

        contactController.submit(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
      });
    });
  });
});
