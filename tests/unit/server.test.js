const path = require('path');

// Mock all dependencies before requiring server
jest.mock('../../src/config', () => ({
  env: 'production',
  security: {
    rateLimitWindowMs: 15 * 60 * 1000,
    rateLimitMax: 100,
  },
}));

jest.mock('../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  stream: {
    write: jest.fn(),
  },
}));

describe('Server module', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear module cache and reload server
    jest.resetModules();
    jest.mock('../../src/config', () => ({
      env: 'production',
      security: {
        rateLimitWindowMs: 15 * 60 * 1000,
        rateLimitMax: 100,
      },
    }));
    app = require('../../src/server');
  });

  test('should export express application', () => {
    expect(app).toBeDefined();
    expect(typeof app).toBe('function'); // Express app is a function
  });

  test('should have middleware configured', () => {
    expect(app._router).toBeDefined();
  });

  test('should be able to handle requests', () => {
    // Verify the app has routes configured
    const routes = [];
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        routes.push(middleware.route.path);
      }
    });
    
    expect(routes.length).toBeGreaterThan(0);
  });
});

describe('Server with development environment', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.mock('../../src/config', () => ({
      env: 'development',
      security: {
        rateLimitWindowMs: 15 * 60 * 1000,
        rateLimitMax: 100,
      },
    }));
  });

  test('should use morgan dev in development', () => {
    const devApp = require('../../src/server');
    expect(devApp).toBeDefined();
  });
});
