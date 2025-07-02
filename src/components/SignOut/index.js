import React from 'react';
import { ApolloConsumer } from 'react-apollo';

import * as routes from '../../constants/routes';
import history from '../../constants/history';
import styled from 'styled-components';
import { removeToken } from '../../utils/auth';

const StyledButton = styled.button`
  position: relative;
  display: block;
  margin: 0 auto;
  text-align: center;
  background: ${props => props.theme.black}; 
  cursor: pointer;
  color: ${props => props.theme.green};
  text-transform: uppercase;
  text-decoration: none;
  font-size: 1.25rem;
  font-family: RussellSquareStd, monospace;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: 3px solid ${props => props.theme.green};
 &:hover {
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px      50px 0 rgba(0,0,0,0.19);
 }
`;

export const signOut = client => {
  // Securely remove token from all storage locations
  removeToken();
  
  // Clear Apollo cache
  client.resetStore();
  
  // Redirect to sign in page
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
