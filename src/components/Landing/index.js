import React from 'react';
import styled from 'styled-components';

import Users from '../UserList';

const StyledLanding = styled.div`
  background: ${props => props.theme.black};
  color: ${props => props.theme.green};
  border: 5px solid ${props => props.theme.green};
`;

const Landing = () => (
  <StyledLanding>
    <Users />
  </StyledLanding>
);

export default Landing;
