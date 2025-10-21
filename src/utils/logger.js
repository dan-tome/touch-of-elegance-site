const fs = require('fs');
const path = require('path');
const config = require('../config');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const colors = {
  error: '\x1b[31m', // Red
  warn: '\x1b[33m',  // Yellow
  info: '\x1b[36m',  // Cyan
  debug: '\x1b[90m', // Gray
};

const reset = '\x1b[0m';

class Logger {
  constructor() {
    this.level = levels[config.logging.level] || levels.info;
  }

  formatMessage(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.length > 0 ? ' ' + args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : arg
    ).join(' ') : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${formattedArgs}`;
  }

  log(level, message, ...args) {
    if (levels[level] <= this.level) {
      const formattedMessage = this.formatMessage(level, message, ...args);
      
      // Console output with colors in development
      if (config.env === 'development') {
        console.log(`${colors[level]}${formattedMessage}${reset}`);
      } else {
        console.log(formattedMessage);
      }

      // Write to file in production
      if (config.env === 'production') {
        const logFile = path.join(logsDir, `${level}.log`);
        fs.appendFileSync(logFile, formattedMessage + '\n');
      }
    }
  }

  error(message, ...args) {
    this.log('error', message, ...args);
  }

  warn(message, ...args) {
    this.log('warn', message, ...args);
  }

  info(message, ...args) {
    this.log('info', message, ...args);
  }

  debug(message, ...args) {
    this.log('debug', message, ...args);
  }

  // For Morgan middleware
  get stream() {
    return {
      write: (message) => {
        this.info(message.trim());
      },
    };
  }
}

module.exports = new Logger();
