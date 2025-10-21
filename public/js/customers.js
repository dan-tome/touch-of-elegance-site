/**
 * Touch of Elegance - Customers Page JavaScript
 * Handles customer management functionality
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
 * Format date to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Load and display all customers
 */
async function loadCustomers() {
  const customersContainer = document.getElementById('customersContainer');
  if (!customersContainer) return;

  try {
    // Show loading state
    customersContainer.innerHTML = '<div class="loading">Loading customers...</div>';

    // Fetch customers from API
    const response = await fetch(`${API_BASE_URL}/customers`);
    
    if (!response.ok) {
      throw new Error('Failed to load customers');
    }

    const data = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error('Invalid response format');
    }

    // Clear loading state
    customersContainer.innerHTML = '';

    // Check if there are any customers
    if (data.data.length === 0) {
      customersContainer.innerHTML = '<div class="empty-state">No customers found. Add your first customer using the form above.</div>';
      return;
    }

    // Render customers
    data.data.forEach(customer => {
      const customerCard = document.createElement('div');
      customerCard.className = 'customer-card';
      customerCard.innerHTML = `
        <div class="customer-info">
          <h4>${escapeHtml(customer.firstName)} ${escapeHtml(customer.lastName)}</h4>
          <p class="customer-phone">📞 ${escapeHtml(customer.phoneNumber)}</p>
          <p class="customer-date">Added: ${formatDate(customer.createdAt)}</p>
        </div>
        <div class="customer-id">ID: ${customer.id}</div>
      `;
      customersContainer.appendChild(customerCard);
    });

  } catch (error) {
    console.error('Error loading customers:', error);
    customersContainer.innerHTML = '<div class="error-state">Failed to load customers. Please try again later.</div>';
    showNotification('Failed to load customers', 'error');
  }
}

/**
 * Handle customer form submission
 */
async function handleCustomerSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  
  const customerData = {
    firstName: formData.get('firstName').trim(),
    lastName: formData.get('lastName').trim(),
    phoneNumber: formData.get('phoneNumber').trim(),
  };

  // Validate form data
  if (!customerData.firstName || !customerData.lastName || !customerData.phoneNumber) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }

  try {
    // Disable submit button to prevent double submission
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Adding...';

    // Submit customer data
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to add customer');
    }

    // Show success message
    showNotification('Customer added successfully!', 'success');

    // Reset form
    form.reset();

    // Reload customers list
    await loadCustomers();

  } catch (error) {
    console.error('Error adding customer:', error);
    showNotification(error.message || 'Failed to add customer', 'error');
  } finally {
    // Re-enable submit button
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Add Customer';
    }
  }
}

/**
 * Initialize the page
 */
function init() {
  // Load customers on page load
  loadCustomers();

  // Set up form submission handler
  const customerForm = document.getElementById('customerForm');
  if (customerForm) {
    customerForm.addEventListener('submit', handleCustomerSubmit);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
