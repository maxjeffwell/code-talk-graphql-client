import { useQuery } from '@apollo/client';
import { useState, useEffect, useRef } from 'react';

/**
 * Hook for progressive data loading - loads basic data first, then detailed data
 * @param {Object} basicQuery - The basic query to load first
 * @param {Object} detailedQuery - The detailed query to load after basic data
 * @param {Object} options - Apollo query options
 * @param {number} delay - Delay before loading detailed data (ms)
 */
export const useProgressiveQuery = (
  basicQuery,
  detailedQuery,
  options = {},
  delay = 500
) => {
  const [loadDetailed, setLoadDetailed] = useState(false);
  const timeoutRef = useRef();

  // Load basic data first
  const basicResult = useQuery(basicQuery, {
    ...options,
    fetchPolicy: 'cache-first',
  });

  // Load detailed data after basic data is loaded
  const detailedResult = useQuery(detailedQuery, {
    ...options,
    skip: !loadDetailed,
    fetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (basicResult.data && !basicResult.loading && !loadDetailed) {
      timeoutRef.current = setTimeout(() => {
        setLoadDetailed(true);
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [basicResult.data, basicResult.loading, loadDetailed, delay]);

  return {
    basicData: basicResult.data,
    detailedData: detailedResult.data,
    loading: basicResult.loading,
    detailedLoading: detailedResult.loading,
    error: basicResult.error || detailedResult.error,
    refetch: () => {
      basicResult.refetch();
      if (loadDetailed) {
        detailedResult.refetch();
      }
    },
  };
};

/**
 * Hook for lazy loading data when component comes into view
 * @param {Object} query - GraphQL query
 * @param {Object} options - Apollo query options
 * @param {Object} intersectionOptions - Intersection observer options
 */
export const useLazyQuery = (query, options = {}, intersectionOptions = {}) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [elementRef, setElementRef] = useState(null);

  const result = useQuery(query, {
    ...options,
    skip: !shouldLoad,
  });

  useEffect(() => {
    if (!elementRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
        ...intersectionOptions,
      }
    );

    observer.observe(elementRef);

    return () => observer.disconnect();
  }, [elementRef, intersectionOptions]);

  return {
    ...result,
    setRef: setElementRef,
    shouldLoad,
  };
};

/**
 * Hook for progressive pagination - loads more data as user scrolls
 * @param {Object} query - GraphQL query with pagination
 * @param {Object} options - Apollo query options
 * @param {number} threshold - Distance from bottom to trigger load (px)
 */
export const useProgressivePagination = (
  query,
  options = {},
  threshold = 200
) => {
  const [loading, setLoading] = useState(false);
  const result = useQuery(query, options);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !result.data) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - threshold) {
        const pageInfo = result.data?.messages?.pageInfo;
        if (pageInfo?.hasNextPage) {
          setLoading(true);
          result.fetchMore({
            variables: {
              cursor: pageInfo.endCursor,
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              setLoading(false);
              if (!fetchMoreResult) return previousResult;

              return {
                messages: {
                  ...fetchMoreResult.messages,
                  edges: [
                    ...previousResult.messages.edges,
                    ...fetchMoreResult.messages.edges,
                  ],
                },
              };
            },
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, result, threshold]);

  return {
    ...result,
    infiniteLoading: loading,
  };
};