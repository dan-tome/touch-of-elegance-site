/**
 * Touch of Elegance - Main JavaScript
 * Handles client-side interactions and API calls
 */

// API Base URL
const API_BASE_URL = '/api';

/**
 * Display a notification message to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of notification ('success', 'error', 'info')
 */
function showNotification(message, type = 'info') {
  // Remove any existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add to page
  document.body.appendChild(notification);

  // Trigger animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}

/**
 * Load services dynamically from the API
 */
async function loadServices() {
  const servicesGrid = document.querySelector('.service-grid');
  if (!servicesGrid) return;

  try {
    // Show loading state
    servicesGrid.innerHTML = '<div class="loading">Loading services...</div>';

    // Fetch services from API
    const response = await fetch(`${API_BASE_URL}/services`);
    
    if (!response.ok) {
      throw new Error('Failed to load services');
    }

    const data = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error('Invalid response format');
    }

    // Clear loading state
    servicesGrid.innerHTML = '';

    // Render services
    data.data.forEach(service => {
      const serviceCard = document.createElement('div');
      serviceCard.className = 'service-card';
      serviceCard.innerHTML = `
        <h3>${escapeHtml(service.name)}</h3>
        <p>${escapeHtml(service.description)}</p>
        ${service.category ? `<span class="service-category">${escapeHtml(service.category)}</span>` : ''}
      `;
      servicesGrid.appendChild(serviceCard);
    });

  } catch (error) {
    console.error('Error loading services:', error);
    servicesGrid.innerHTML = '<div class="error">Failed to load services. Please try again later.</div>';
  }
}

/**
 * Handle contact form submission
 * @param {Event} event - The form submit event
 */
async function handleContactFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;

  // Get form data
  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    message: form.message.value.trim()
  };

  // Basic validation
  if (!formData.name || !formData.email || !formData.message) {
    showNotification('Please fill in all required fields.', 'error');
    return;
  }

  // Email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(formData.email)) {
    showNotification('Please enter a valid email address.', 'error');
    return;
  }

  try {
    // Disable submit button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    // Submit form data
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showNotification(data.message || 'Thank you for contacting us! We will get back to you soon.', 'success');
      form.reset();
    } else {
      throw new Error(data.error || 'Failed to submit form');
    }

  } catch (error) {
    console.error('Error submitting contact form:', error);
    showNotification(error.message || 'Failed to submit form. Please try again.', 'error');
  } finally {
    // Re-enable submit button
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - The text to escape
 * @returns {string} - The escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Add smooth scrolling to navigation links
 */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * Initialize the application
 */
function init() {
  // Load services dynamically
  loadServices();

  // Setup contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactFormSubmit);
  }

  // Enable smooth scrolling
  initSmoothScrolling();

  console.log('Touch of Elegance - Application initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
