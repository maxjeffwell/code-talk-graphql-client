import { useEffect, useRef, useState } from 'react';

/**
 * Hook for intersection observer functionality
 * @param {Object} options - Intersection observer options
 * @param {Function} callback - Callback function when intersection changes
 * @param {Array} dependencies - Dependencies to re-run the effect
 */
export const useIntersectionObserver = (
  options = {},
  callback = null,
  dependencies = []
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState(null);
  const targetRef = useRef();

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);
        
        if (callback) {
          callback(entry);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [callback, ...dependencies]);

  return { targetRef, isIntersecting, entry };
};

/**
 * Hook for triggering actions when element comes into view
 * @param {Function} onIntersect - Function to call when element intersects
 * @param {Object} options - Intersection observer options
 * @param {boolean} once - Whether to trigger only once
 */
export const useOnIntersect = (
  onIntersect,
  options = {},
  once = true
) => {
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef();

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasIntersected)) {
          onIntersect(entry);
          setHasIntersected(true);
          
          if (once) {
            observer.disconnect();
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [onIntersect, once, hasIntersected, options]);

  return { targetRef, hasIntersected };
};

/**
 * Hook for lazy loading with visibility detection
 * @param {Object} options - Intersection observer options
 */
export const useVisibility = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const targetRef = useRef();

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && !hasBeenVisible) {
          setHasBeenVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasBeenVisible, options]);

  return { targetRef, isVisible, hasBeenVisible };
};

/**
 * Hook for progressive content loading based on scroll position
 * @param {number} sections - Number of sections to load progressively
 * @param {Object} options - Intersection observer options
 */
export const useProgressiveContent = (sections = 3, options = {}) => {
  const [loadedSections, setLoadedSections] = useState(new Set([0])); // Load first section by default
  const sectionsRefs = useRef([]);

  useEffect(() => {
    const observers = sectionsRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setLoadedSections(prev => new Set([...prev, index]));
          }
        },
        {
          threshold: 0.1,
          rootMargin: '100px',
          ...options,
        }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, [sections, options]);

  const setRef = (index) => (element) => {
    sectionsRefs.current[index] = element;
  };

  const shouldLoad = (index) => loadedSections.has(index);

  return { setRef, shouldLoad, loadedSections };
};