import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from './index';

describe('<Loading />', () => {
  it('Should render without crashing', () => {
    render(<Loading />);
  });

  it('Should display loading spinner', () => {
    render(<Loading />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
  });
});