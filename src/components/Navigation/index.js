import React from 'react';
import { Link } from 'react-router-dom';

import * as routes from '../../constants/routes';
import Header from '../Header';
import SignOutButton from '../SignOut';
import styled from 'styled-components';

const Logo = styled.h3`
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
  }
`;

const Navigation = ({ session }) => (
  <div>
    {session && session.me ? (
      <NavigationAuth session={session} />
    ) : (
      <NavigationNonAuth />
    )}
  </div>
);

const NavigationAuth = ({ session }) => (
  <div className="Header">
  <Header />
    <SignOutButton />
    <Logo>
      <Link to={routes.LANDING}>Landing</Link>
      </Logo>
      <Logo>
      <Link to={routes.ACCOUNT}>Your Account ({session.me.username})</Link>
      </Logo>
    {session &&
    session.me &&
    session.me.role === 'ADMIN' && (
      <Logo>
        <Link to={routes.ADMIN}>Admin</Link>
        </Logo>
    )}
    {session &&
    session.me && (
    <Logo>
      <Link to={routes.EDITOR}>Code Talk</Link>
      </Logo>
    )}
</div>
);

const NavigationNonAuth = () => (
  <div className="Nav-Bar">
    <Header />
    <Logo>
      <Link to={routes.SIGN_IN}>Sign In</Link>
      </Logo>
      <Logo>
      <Link to={routes.LANDING}>Code Talk Home</Link>
      </Logo>
    </div>
);

export default Navigation;
