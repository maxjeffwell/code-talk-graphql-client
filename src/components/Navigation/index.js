import React, { Fragment, memo } from 'react';
import styled from 'styled-components';

import NavigationAuth from './Auth';
import NavigationNonAuth from './NonAuth';
// Note: Authentication uses httpOnly cookies - we rely on session data, not token checks

export const Logo = styled.h1`
  font-size: 1.5rem;
  text-align: center;
  margin: 1rem 0 2rem 0;
  position: relative;
  a  {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: ${props => props.theme.black};
    color: ${props => props.theme.green};
    text-transform: uppercase;
    text-decoration: none;
    margin: 5px;
    border-radius: 5px;
    border: 4px solid ${props => props.theme.green};
    cursor: pointer;
  }
  a:hover {
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
  }
`;

export const StyledParagraph = styled.p`
  display: inline;
  position: relative;
  margin: 0 0 10px;
  font-size: 1.5rem;
  text-align: center;
  @media (max-width: 1000px) {
      margin: 5px;
    }
`;

const Navigation = memo(({ session, sessionLoading }) => {
  // With httpOnly cookies, we rely solely on session data for auth status
  // While loading, we show non-auth nav to avoid flash (brief loading state is acceptable)
  const isAuthenticated = session && session.me;

  return (
    <Fragment>
      {isAuthenticated ? (
        <NavigationAuth session={session} />
      ) : (
        <NavigationNonAuth />
      )}
    </Fragment>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;
