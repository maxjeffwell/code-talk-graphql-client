import React from 'react';
import { Link } from 'react-router-dom';

import * as routes from '../../constants/routes';
import SignOutButton from '../SignOut';
import styled from 'styled-components';

const Logo = styled.h3`
  font-size: 1rem;
  margin-left: 1rem;
  position: relative;
  z-index: 2;
  transform: skew(-5deg);
  a { 
    padding: 0.5rem 1rem;
    background: ${props => props.theme.black};
    color: ${props => props.theme.green};
    text-transform: uppercase;
    text-decoration: none;
  }
  @media (max-width: 1300px) {
    margin: 0;
    text-align: center;
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
  <div className="Nav-Bar">
  <ul>
    <li>
      <Logo>
      <Link to={routes.LANDING}>Landing</Link>
      </Logo>
    </li>
    <li>
      <Logo>
      <Link to={routes.ACCOUNT}>Account ({session.me.username})</Link>
      </Logo>
    </li>
    {session &&
    session.me &&
    session.me.role === 'ADMIN' && (
      <li>
        <Logo>
        <Link to={routes.ADMIN}>Admin</Link>
        </Logo>
      </li>
    )}
    <li>
      <Logo>
      <Link to={routes.EDITOR}>Code Talk</Link>
      </Logo>
    </li>
    <li>
      <SignOutButton />
    </li>
  </ul>
  </div>
);

const NavigationNonAuth = () => (
  <ul>
    <li>
      <Logo>
      <Link to={routes.SIGN_IN}>Sign In</Link>
      </Logo>
      </li>
    <li>
      <Logo>
      <Link to={routes.LANDING}>Landing</Link>
      </Logo>
      </li>
  </ul>
);

export default Navigation;
