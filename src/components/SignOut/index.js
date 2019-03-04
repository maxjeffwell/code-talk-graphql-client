import React from 'react';
import { ApolloConsumer } from 'react-apollo';

import * as routes from '../../constants/routes';
import history from '../../constants/history';
import styled from 'styled-components';

const StyledButton = styled.button` S
  position: relative;
  margin-left: 10px;
  background: ${props => props.theme.black}; 
  cursor: pointer;
  color: ${props => props.theme.green};
  text-transform: uppercase;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: 5px solid ${props => props.theme.green};
 @media (max-width: 1000px) {
    margin: 2px;
    text-align: center;
  }
 &:hover {
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px      50px 0 rgba(0,0,0,0.19);
 }
`;

export const signOut = client => {
  localStorage.setItem('token', '');
  client.resetStore();
  history.push(routes.SIGN_IN);
};

const SignOutButton = () => (
  <ApolloConsumer>
    {client => (
      <div>
      <StyledButton type="button" onClick={() => signOut(client)}>
        Sign Out
      </StyledButton>
      </div>
    )}
  </ApolloConsumer>
);

export default SignOutButton;
