const logger = require('../utils/logger');

// In-memory storage - In a real app, this would be a database
// This structure makes it easy to migrate to a database later
let customers = [];
let nextId = 1;

const getAll = (req, res) => {
  try {
    logger.info('Fetching all customers');
    res.json({
      success: true,
      data: customers,
    });
  } catch (error) {
    logger.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customers',
    });
  }
};

const getById = (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching customer with id: ${id}`);
    
    const customer = customers.find(c => c.id === parseInt(id));
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found',
      });
    }

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    logger.error('Error fetching customer:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer',
    });
  }
};

const create = (req, res) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body;
    
    // Validate required fields
    if (!firstName || firstName.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'First name is required',
      });
    }
    
    if (!lastName || lastName.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Last name is required',
      });
    }
    
    if (!phoneNumber || phoneNumber.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required',
      });
    }

    // Create new customer
    const newCustomer = {
      id: nextId++,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: phoneNumber.trim(),
      createdAt: new Date().toISOString(),
    };

    customers.push(newCustomer);
    logger.info(`Customer created: ${JSON.stringify({ id: newCustomer.id, firstName: newCustomer.firstName, lastName: newCustomer.lastName })}`);

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: newCustomer,
    });
  } catch (error) {
    logger.error('Error creating customer:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create customer',
    });
  }
};

module.exports = {
  getAll,
  getById,
  create,
};
