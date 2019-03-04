import React from 'react';
import styled from 'styled-components';

import withAuthorization from '../Session/withAuthorization';

const StyledHeader = styled.h1`
  color: ${props => props.theme.green};
  background-color: ${props => props.theme.black};
  border: 5px solid ${props => props.theme.green};
  display: grid;
  border-radius: 5px;
  padding-left: 5px;
  padding-right: 5px;
  text-align: center;
  line-height: 1.5;
  margin: 50px auto;
  position: relative;
  width: 50%;
  min-width: 142px;
`;

const AccountPage = () => (
  <div role="main">
  <section id="user-account-info" role="contentinfo">
    <StyledHeader>ACCOUNT PAGE</StyledHeader>
  </section>
  </div>
);

export default withAuthorization(session => session && session.me)(
  AccountPage,
);
