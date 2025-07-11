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
    // Basic performance tracking without web-vitals dependency
    if (typeof window !== 'undefined' && window.performance) {
      // Use native Performance API for basic metrics
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          onPerfEntry({
            name: entry.name,
            value: entry.startTime,
            delta: entry.duration,
            id: entry.entryType
          });
        }
      });
      
      try {
        observer.observe({ entryTypes: ['navigation', 'paint'] });
      } catch (error) {
        console.warn('Performance observer not supported:', error);
      }
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