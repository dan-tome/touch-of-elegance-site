# Test Suite Documentation

This directory contains comprehensive tests for the Touch of Elegance application.

## Test Structure

```
tests/
├── unit/                    # Unit tests for individual modules
│   ├── config.test.js       # Configuration module tests
│   ├── logger.test.js       # Logger utility tests
│   ├── errorHandler.test.js # Error handler middleware tests
│   ├── rateLimiter.test.js  # Rate limiter middleware tests
│   ├── servicesController.test.js # Services controller tests
│   ├── contactController.test.js  # Contact controller tests
│   └── server.test.js       # Server setup tests
└── integration/             # Integration tests
    ├── routes.test.js       # API routes integration tests
    └── server.test.js       # Full server integration tests
```

## Test Coverage

The test suite achieves comprehensive coverage:

- **Statements**: 96.72%
- **Branches**: 90.69%
- **Functions**: 94.73%
- **Lines**: 96.69%

### Module Coverage

| Module | Coverage |
|--------|----------|
| Config | 100% |
| Controllers | 100% |
| Middleware | 100% |
| Routes | 100% |
| Utils (Logger) | 89.65% |

## Running Tests

### Run all tests with coverage
```bash
npm test
```

### Run tests in watch mode (for development)
```bash
npm run test:watch
```

### Run tests for CI/CD
```bash
npm run test:ci
```

### Run specific test file
```bash
npm test -- tests/unit/config.test.js
```

### Run tests with verbose output
```bash
npm test -- --verbose
```

## Test Categories

### Unit Tests

Unit tests focus on individual modules in isolation:

1. **Configuration Tests** (`config.test.js`)
   - Default values
   - Environment variable parsing
   - API, CORS, logging, and security configurations

2. **Logger Tests** (`logger.test.js`)
   - Message formatting
   - Log levels (error, warn, info, debug)
   - Stream support for Morgan
   - Production vs development behavior

3. **Error Handler Tests** (`errorHandler.test.js`)
   - Custom status codes
   - Default error responses
   - Error logging
   - Stack traces in development

4. **Rate Limiter Tests** (`rateLimiter.test.js`)
   - API rate limiter configuration
   - Contact form rate limiter configuration
   - Request handling within limits

5. **Services Controller Tests** (`servicesController.test.js`)
   - Get all services
   - Get service by ID
   - Service categories (cleaning, tailoring, specialty)
   - Error handling

6. **Contact Controller Tests** (`contactController.test.js`)
   - Valid form submissions
   - Required field validation
   - Email format validation
   - Error handling

7. **Server Tests** (`server.test.js`)
   - Express app configuration
   - Middleware setup
   - Development vs production environments

### Integration Tests

Integration tests verify the complete application flow:

1. **Routes Integration Tests** (`integration/routes.test.js`)
   - API endpoint functionality
   - Request/response handling
   - Health check endpoint
   - 404 handling
   - Security headers
   - CORS support

2. **Server Integration Tests** (`integration/server.test.js`)
   - Middleware stack
   - Error handling
   - API availability
   - Response formats
   - Security middleware
   - Rate limiting
   - HTTP methods
   - Content negotiation

## Test Utilities

The test suite uses:

- **Jest**: Testing framework
- **Supertest**: HTTP assertion library for integration tests
- **Jest Mocks**: For mocking dependencies in unit tests

## Writing New Tests

### Unit Test Template

```javascript
const myModule = require('../../src/path/to/module');

describe('My Module', () => {
  let mockDependency;

  beforeEach(() => {
    // Setup
    mockDependency = jest.fn();
  });

  afterEach(() => {
    // Cleanup
    jest.clearAllMocks();
  });

  test('should do something', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = myModule.doSomething(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

### Integration Test Template

```javascript
const request = require('supertest');
const app = require('../../src/server');

describe('API Endpoint', () => {
  test('should return expected response', async () => {
    const response = await request(app)
      .get('/api/endpoint')
      .expect(200);

    expect(response.body).toHaveProperty('key', 'value');
  });
});
```

## Coverage Reports

Coverage reports are generated in the `coverage/` directory after running tests.

### View HTML Coverage Report

After running tests, open `coverage/lcov-report/index.html` in a browser to see detailed coverage information.

### Coverage Thresholds

The project enforces minimum coverage thresholds:

- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

Tests will fail if coverage drops below these thresholds.

## Continuous Integration

The test suite is designed to run in CI/CD pipelines:

```bash
npm run test:ci
```

This command:
- Runs tests once (no watch mode)
- Generates coverage reports
- Limits worker threads for CI environments
- Exits with appropriate status code

## Best Practices

1. **Keep tests focused**: Each test should verify one thing
2. **Use descriptive names**: Test names should explain what is being tested
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Mock external dependencies**: Isolate the code under test
5. **Test edge cases**: Include tests for error conditions and boundary cases
6. **Maintain high coverage**: Aim for >90% coverage on critical paths
7. **Keep tests fast**: Use mocks to avoid slow operations
8. **Make tests deterministic**: Tests should not depend on external state

## Troubleshooting

### Tests failing due to rate limiting

Some integration tests may be affected by rate limiting. The tests are designed to handle this gracefully by accepting multiple status codes (e.g., 200 or 429).

### Port conflicts

If you see port conflicts, ensure no other processes are using the test ports.

### Module mocking issues

If mocks aren't working as expected, ensure you're calling `jest.clearAllMocks()` in `afterEach()` hooks.

## Contributing

When adding new features:

1. Write tests first (TDD approach recommended)
2. Ensure all tests pass: `npm test`
3. Verify linting: `npm run lint`
4. Check coverage hasn't decreased
5. Update this documentation if needed
