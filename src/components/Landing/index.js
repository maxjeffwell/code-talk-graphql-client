import React from 'react';

import styled from 'styled-components';

const StyledLanding = styled.div`
  background: ${props => props.theme.white};
  color: ${props => props.theme.black};
`;

const Landing = () => (
  <StyledLanding>
    <h2>Landing Page</h2>
  </StyledLanding>
);

export default Landing;
