/**
 * Performance monitoring utilities for lazy loading
 */
import logger from './logger';

export const measurePerformance = (name, fn) => {
  const startTime = performance.now();
  const result = fn();
  const endTime = performance.now();
  
  logger.perf(`${name} took ${endTime - startTime} milliseconds`);
  return result;
};

export const measureComponentLoad = (componentName) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    logger.perf(`${componentName} lazy loaded in ${endTime - startTime}ms`);
  };
};

export const observeIntersection = (element, callback) => {
  const startTime = performance.now();
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const endTime = performance.now();
        logger.perf(`Element intersected after ${endTime - startTime}ms`);
        callback(entry);
      }
    });
  });
  
  observer.observe(element);
  return observer;
};

export const reportWebVitals = (metric) => {
  // Report web vitals for performance monitoring
  logger.perf('Web Vitals:', metric);
  
  // In production, you might want to send these to an analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: gtag('event', metric.name, { value: metric.value });
  }
};

export const measureBundleSize = () => {
  if (typeof window !== 'undefined' && window.performance) {
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const entry = navigationEntries[0];
      logger.perf('Bundle Load Performance:', {
        domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
        loadComplete: entry.loadEventEnd - entry.loadEventStart,
        transferSize: entry.transferSize,
        encodedBodySize: entry.encodedBodySize,
        decodedBodySize: entry.decodedBodySize
      });
    }
  }
};