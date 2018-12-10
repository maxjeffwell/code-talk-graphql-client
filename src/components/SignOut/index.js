import React from 'react';
import { ApolloConsumer } from 'react-apollo';

import * as routes from '../../constants/routes';
import history from '../../constants/history';
import styled from 'styled-components';

const StyledButton = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;
`;

const SignOutButton = () => (
  <ApolloConsumer>
    {client => (
      <StyledButton type="button" onClick={() => signOut(client)}>
        Sign Out
      </StyledButton>
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
