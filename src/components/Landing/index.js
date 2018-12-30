import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import * as routes from '../../constants/routes';
import Users from '../UserList';

const StyledLanding = styled.div`
  background: ${props => props.theme.white};
  color: ${props => props.theme.black};
`;

const Landing = () => (
  <StyledLanding>
    <Link to={routes.MONACO}>Code Talk Monaco</Link>
    <h2>Landing Page</h2>
    <Users />
  </StyledLanding>
);

export default Landing;
