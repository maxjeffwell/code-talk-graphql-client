import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import Footer from './index';
import theme from '../../theme';

describe('<Footer />', () => {
  const renderWithTheme = (component) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  it('Should render without crashing', () => {
    renderWithTheme(<Footer />);
  });

  it('Should display copyright text', () => {
    renderWithTheme(<Footer />);
    expect(screen.getByText(/Copyright © 2019 Code Talk/i)).toBeInTheDocument();
  });

  it('Should have footer element', () => {
    renderWithTheme(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('footer');
  });
});