const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');
const contactController = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimiter');

// Services routes
router.get('/services', servicesController.getAll);
router.get('/services/:id', servicesController.getById);

// Contact route with stricter rate limiting
router.post('/contact', contactLimiter, contactController.submit);

// API info
router.get('/', (req, res) => {
  res.json({
    message: 'Touch of Elegance API',
    version: '1.0.0',
    endpoints: {
      services: '/api/services',
      contact: '/api/contact',
      health: '/health',
    },
  });
});

module.exports = router;
