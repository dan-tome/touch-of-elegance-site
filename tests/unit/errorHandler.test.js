jest.mock('../../src/utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

jest.mock('../../src/config', () => ({
  env: 'test',
}));

const errorHandler = require('../../src/middleware/errorHandler');
const logger = require('../../src/utils/logger');

describe('Error Handler Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    logger.error = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should handle error with custom status code', () => {
    const error = new Error('Custom error');
    error.statusCode = 400;

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: {
        message: 'Custom error',
        status: 400,
      },
    });
  });

  test('should default to 500 status code when not provided', () => {
    const error = new Error('Server error');

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: {
        message: 'Server error',
        status: 500,
      },
    });
  });

  test('should use default error message when not provided', () => {
    const error = new Error();
    delete error.message;

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          message: 'Internal Server Error',
        }),
      })
    );
  });

  test('should log the error', () => {
    const error = new Error('Test error');

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(logger.error).toHaveBeenCalledWith('Error occurred:', error);
  });

  test('should include stack trace in development environment', () => {
    jest.resetModules();
    jest.mock('../../src/config', () => ({
      env: 'development',
    }));
    const devErrorHandler = require('../../src/middleware/errorHandler');

    const error = new Error('Dev error');
    error.stack = 'Error stack trace';

    devErrorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          stack: 'Error stack trace',
        }),
      })
    );
  });

  test('should handle errors without stack trace', () => {
    const error = { message: 'Error without stack' };

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalled();
  });
});
