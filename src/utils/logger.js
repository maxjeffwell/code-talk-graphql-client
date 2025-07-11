// Logger utility that only logs in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  error: (...args) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
  
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
  
  // Performance logging (always enabled in dev, can be enabled in prod via env var)
  perf: (...args) => {
    if (isDevelopment || process.env.REACT_APP_ENABLE_PERF_LOGGING === 'true') {
      console.log('[PERF]', ...args);
    }
  }
};

export default logger;