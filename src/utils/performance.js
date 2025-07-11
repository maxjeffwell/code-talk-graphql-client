// Performance monitoring utilities for Code Talk app

export const measurePerformance = (name, fn) => {
  return (...args) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name} took ${end - start} milliseconds`);
    }
    
    return result;
  };
};

export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.performance) {
      import('web-vitals').then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
        try {
          onCLS(onPerfEntry);
          onFCP(onPerfEntry);
          onINP(onPerfEntry); // INP replaces FID in v5
          onLCP(onPerfEntry);
          onTTFB(onPerfEntry);
        } catch (error) {
          console.warn('Error initializing web-vitals:', error);
        }
      }).catch(error => {
        console.warn('Error loading web-vitals:', error);
      });
    }
  }
};

export const trackComponentRender = (componentName) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`${componentName} rendered at ${Date.now()}`);
  }
};

export const trackNetworkRequest = (url, method = 'GET') => {
  const start = performance.now();
  
  return {
    end: () => {
      const end = performance.now();
      if (process.env.NODE_ENV === 'development') {
        console.log(`Network request to ${url} (${method}) took ${end - start} milliseconds`);
      }
    }
  };
};

// Memory usage tracking
export const trackMemoryUsage = () => {
  if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
    const memInfo = performance.memory;
    console.log({
      usedJSHeapSize: memInfo.usedJSHeapSize,
      totalJSHeapSize: memInfo.totalJSHeapSize,
      jsHeapSizeLimit: memInfo.jsHeapSizeLimit
    });
  }
};

// Performance observer for long tasks
export const observeLongTasks = () => {
  if (process.env.NODE_ENV === 'development' && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) { // Tasks longer than 50ms
          console.warn(`Long task detected: ${entry.duration}ms`);
        }
      }
    });
    
    observer.observe({ entryTypes: ['longtask'] });
  }
};