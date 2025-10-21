const logger = require('../utils/logger');

const submit = (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address',
      });
    }

    // Log the contact submission
    logger.info('Contact form submission:', { name, email, phone });

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send confirmation email to user

    res.status(200).json({
      success: true,
      message: 'Your message has been received. We will contact you soon!',
    });
  } catch (error) {
    logger.error('Error processing contact form:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process contact form',
    });
  }
};

module.exports = {
  submit,
};
