import React from 'react';
import styled from 'styled-components';

import Users from '../UserList';

const StyledLanding = styled.div`
  background: ${props => props.theme.white};
  color: ${props => props.theme.black};
`;

const Landing = () => (
  <StyledLanding>
    <h2>Landing Page</h2>
    <Users />
  </StyledLanding>
);

export default Landing;
