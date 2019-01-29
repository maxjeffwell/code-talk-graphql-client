import React from 'react';
import styled from 'styled-components';

import withAuthorization from '../Session/withAuthorization';

const StyledHeader = styled.h1`
  color: ${props => props.theme.green};
  background-color: ${props => props.theme.black};
  border: 5px solid ${props => props.theme.green};
  border-radius: 5px;
  display: grid;
  text-align: center;
  margin: 50px auto;
  width: 25%;
`;

const StyledP = styled.p`
  text-align: center;
`

const AccountPage = () => (
  <div role="main">
  <section id="user-account-info" role="contentinfo">
    <StyledHeader>ACCOUNT PAGE</StyledHeader>
    <StyledP>Account features coming soon. Stay tuned...</StyledP>
  </section>
  </div>
);

export default withAuthorization(session => session && session.me)(
  AccountPage,
);
