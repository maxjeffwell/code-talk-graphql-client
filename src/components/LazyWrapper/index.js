import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const loading = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

const Container = styled.div`
  min-height: ${props => props.minHeight || '100px'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingPlaceholder = styled.div`
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: ${loading} 1.5s infinite;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  color: #999;
  width: 100%;
  max-width: 400px;
`;

const LazyWrapper = ({ 
  children, 
  placeholder = "Loading...", 
  minHeight = "100px",
  rootMargin = "100px",
  threshold = 0.1,
  delay = 0,
  ...props 
}) => {
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add optional delay for staggered loading
          if (delay > 0) {
            setTimeout(() => {
              setInView(true);
            }, delay);
          } else {
            setInView(true);
          }
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold, delay]);

  useEffect(() => {
    if (inView && !loaded) {
      // Simulate component loading time
      const timer = setTimeout(() => {
        setLoaded(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [inView, loaded]);

  return (
    <Container ref={containerRef} minHeight={minHeight} {...props}>
      {loaded ? (
        children
      ) : (
        <LoadingPlaceholder>
          {placeholder}
        </LoadingPlaceholder>
      )}
    </Container>
  );
};

export default LazyWrapper;