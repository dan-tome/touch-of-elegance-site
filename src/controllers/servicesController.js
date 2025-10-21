const logger = require('../utils/logger');

// Mock data - In a real app, this would come from a database
const services = [
  {
    id: 1,
    name: 'Dry Cleaning',
    description: 'Professional dry cleaning for all types of garments including suits, dresses, and delicate fabrics.',
    category: 'cleaning',
  },
  {
    id: 2,
    name: 'Laundry Service',
    description: 'Wash, dry, and fold services for your everyday clothing and household items.',
    category: 'cleaning',
  },
  {
    id: 3,
    name: 'Alterations',
    description: 'Expert tailoring and alterations to ensure the perfect fit for your garments.',
    category: 'tailoring',
  },
  {
    id: 4,
    name: 'Wedding Gown Care',
    description: 'Specialized cleaning and preservation for wedding dresses and formal wear.',
    category: 'specialty',
  },
  {
    id: 5,
    name: 'Leather & Suede',
    description: 'Professional cleaning and care for leather jackets, suede garments, and accessories.',
    category: 'specialty',
  },
  {
    id: 6,
    name: 'Household Items',
    description: 'Cleaning services for curtains, bedding, tablecloths, and other household textiles.',
    category: 'cleaning',
  },
];

const getAll = (req, res) => {
  try {
    logger.info('Fetching all services');
    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    logger.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch services',
    });
  }
};

const getById = (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching service with id: ${id}`);
    
    const service = services.find(s => s.id === parseInt(id));
    
    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found',
      });
    }

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    logger.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch service',
    });
  }
};

module.exports = {
  getAll,
  getById,
};
