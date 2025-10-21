const logger = require('../utils/logger');
const config = require('../config');

const errorHandler = (err, req, res, _next) => {
  logger.error('Error occurred:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const response = {
    error: {
      message,
      status: statusCode,
    },
  };

  // Include stack trace in development
  if (config.env === 'development') {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
