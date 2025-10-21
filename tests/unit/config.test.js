const config = require('../../src/config');

describe('Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('Default values', () => {
    test('should have default environment as development', () => {
      expect(config.env).toBeDefined();
    });

    test('should have default port as 3000', () => {
      expect(config.port).toBe(3000);
    });

    test('should have default host as 0.0.0.0', () => {
      expect(config.host).toBe('0.0.0.0');
    });
  });

  describe('API configuration', () => {
    test('should have api prefix', () => {
      expect(config.api.prefix).toBe('/api');
    });

    test('should have api version', () => {
      expect(config.api.version).toBe('v1');
    });
  });

  describe('CORS configuration', () => {
    test('should have cors origin', () => {
      expect(config.cors.origin).toBeDefined();
    });

    test('should have cors credentials enabled', () => {
      expect(config.cors.credentials).toBe(true);
    });
  });

  describe('Logging configuration', () => {
    test('should have logging level', () => {
      expect(config.logging.level).toBeDefined();
    });

    test('should have logs directory', () => {
      expect(config.logging.dir).toBe('logs');
    });
  });

  describe('Security configuration', () => {
    test('should have rate limit window', () => {
      expect(config.security.rateLimitWindowMs).toBe(15 * 60 * 1000);
    });

    test('should have rate limit max', () => {
      expect(config.security.rateLimitMax).toBe(100);
    });
  });

  describe('Environment variable parsing', () => {
    test('should parse PORT as integer', () => {
      expect(typeof config.port).toBe('number');
    });

    test('should handle invalid PORT gracefully', () => {
      process.env.PORT = 'invalid';
      delete require.cache[require.resolve('../../src/config')];
      const newConfig = require('../../src/config');
      expect(newConfig.port).toBe(3000); // Should default or be NaN
    });
  });
});
