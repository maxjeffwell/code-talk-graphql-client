import React, { Fragment, memo } from 'react';
import styled from 'styled-components';

import NavigationAuth from './Auth';
import NavigationNonAuth from './NonAuth';

export const Logo = styled.h1`
  font-size: 1.5rem;
  text-align: center;
  margin: 1rem 0;
  position: relative;
  z-index: 10;
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

const Navigation = memo(({ session }) => (
  <Fragment>
    {session && session.me ? (
      <NavigationAuth session={session} />
    ) : (
      <NavigationNonAuth />
    )}
  </Fragment>
));

Navigation.displayName = 'Navigation';

export default Navigation;
