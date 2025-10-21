const rateLimit = require('express-rate-limit');
const config = require('../config');

// General rate limiter for all API endpoints
const apiLimiter = rateLimit({
  windowMs: config.security.rateLimitWindowMs,
  max: config.security.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});

// Stricter rate limiter for contact form
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many contact form submissions from this IP, please try again later.',
});

module.exports = {
  apiLimiter,
  contactLimiter,
};
