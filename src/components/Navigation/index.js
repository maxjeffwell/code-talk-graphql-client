import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import * as routes from '../../constants/routes';
import Header from '../Header';
import SignOutButton from '../SignOut';

const Logo = styled.h1`
  font-size: 1.5rem;
  position: relative;
  z-index: 2;
  text-align: center;
  a { 
    padding: 0.5rem 1rem;
    background: ${props => props.theme.black};
    color: ${props => props.theme.green};
    text-transform: uppercase;
    text-decoration: none;
    margin: 5px;
    border-radius: 5px;
    border: 5px solid ${props => props.theme.green};
    cursor: pointer;
  }
  a:hover {
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px      50px 0 rgba(0,0,0,0.19);
  }
`;

const Navigation = ({ session }) => (
  <div className="route types" role="navigation">
    {session && session.me ? (
      <NavigationAuth session={session} />
    ) : (
      <NavigationNonAuth />
    )}
  </div>
);

const NavigationAuth = ({ session }) =>
  <div className="header">
  <Header />
  <SignOutButton />
  <Logo>
    <Link to={routes.ACCOUNT}>Your Account ({session.me.username})</Link>
  </Logo>
    <Logo>
      <Link to={routes.ROOMS}>Code Talk Chat Rooms</Link>
    </Logo>
  </div>;

const NavigationNonAuth = () =>
  <div className="Nav-Bar" role="navigation">
    <Header />
    <Logo>
      <Link to={routes.SIGN_IN}>Sign In</Link>
      </Logo>
  </div>;

export default Navigation;
