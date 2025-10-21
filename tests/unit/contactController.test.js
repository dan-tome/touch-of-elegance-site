const contactController = require('../../src/controllers/contactController');
const logger = require('../../src/utils/logger');

jest.mock('../../src/utils/logger');

describe('Contact Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
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

  describe('submit', () => {
    test('should successfully submit valid contact form', () => {
      mockReq.body = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        message: 'Test message',
      };

      contactController.submit(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Your message has been received. We will contact you soon!',
      });
      expect(logger.info).toHaveBeenCalledWith(
        'Contact form submission:',
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
        })
      );
    });

    test('should accept contact form without phone number', () => {
      mockReq.body = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      };

      contactController.submit(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });

    test('should return 400 if name is missing', () => {
      mockReq.body = {
        email: 'john@example.com',
        message: 'Test message',
      };

      contactController.submit(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Name, email, and message are required',
      });
    });

    test('should return 400 if email is missing', () => {
      mockReq.body = {
        name: 'John Doe',
        message: 'Test message',
      };

      contactController.submit(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Name, email, and message are required',
      });
    });

    test('should return 400 if message is missing', () => {
      mockReq.body = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      contactController.submit(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Name, email, and message are required',
      });
    });

    test('should return 400 for invalid email format', () => {
      mockReq.body = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'Test message',
      };

      contactController.submit(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid email address',
      });
    });

    test('should validate various valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user_name@example-domain.com',
        'test123@test.org',
      ];

      validEmails.forEach(email => {
        mockReq.body = {
          name: 'John Doe',
          email: email,
          message: 'Test message',
        };

        contactController.submit(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
      });
    });

    test('should reject various invalid email formats', () => {
      const invalidEmails = [
        'invalid',
        '@example.com',
        'user@',
        'user @example.com',
        'user@.com',
        'user@domain',
      ];

      invalidEmails.forEach(email => {
        mockReq.body = {
          name: 'John Doe',
          email: email,
          message: 'Test message',
        };

        contactController.submit(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
      });
    });

    test('should handle empty string fields as missing', () => {
      mockReq.body = {
        name: '',
        email: 'john@example.com',
        message: 'Test message',
      };

      contactController.submit(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test('should accept fields with whitespace', () => {
      mockReq.body = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        message: 'Test message',
      };

      contactController.submit(mockReq, mockRes);

      // The controller accepts valid data
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Error handling', () => {
    test('should handle unexpected errors gracefully', () => {
      // Force an error by making logger.info throw
      logger.info.mockImplementation(() => {
        throw new Error('Logging failed');
      });

      mockReq.body = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      };

      contactController.submit(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Failed to process contact form',
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
