import React from 'react';
import { ApolloConsumer } from 'react-apollo';

import * as routes from '../../constants/routes';
import history from '../../constants/history';
import styled from 'styled-components';

const StyledButton = styled.button`
  background: #393939; 
  cursor: pointer;
  color: #30d403;
  text-transform: uppercase;
  text-decoration: none;
  font-family: mr_robot;
  font-size: .75em;
  position: fixed;
  margin: 0em;
  padding: 0.25em 1em;
  border-radius: 5px;
 @media (max-width: 1000px) {
    margin: 0px;
    text-align: center;
  }
`;

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

const signOut = client => {
  localStorage.setItem('token', '');
  client.resetStore();
  history.push(routes.SIGN_IN);
};

export { signOut };

export default SignOutButton;
