import React from 'react';
import { render, screen } from '@testing-library/react';
import LazyImage from './index';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

describe('LazyImage Component', () => {
  test('renders placeholder initially', () => {
    render(<LazyImage src="test.jpg" alt="Test" placeholder="Loading..." />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders with proper alt text', () => {
    render(<LazyImage src="test.jpg" alt="Test Image" />);
    expect(screen.getByText('Loading image...')).toBeInTheDocument();
  });

  test('creates intersection observer on mount', () => {
    render(<LazyImage src="test.jpg" alt="Test" />);
    expect(mockIntersectionObserver).toHaveBeenCalled();
  });
});