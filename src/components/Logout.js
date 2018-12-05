import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { Redirect } from 'react-router-dom';

export default () => (
  <ApolloConsumer>

    {/*direct access to apollo store*/}

    {client => {
      client.resetStore();

      /*wipes apollo's cache*/

      localStorage.setItem('AUTH_TOKEN', '');
      return <Redirect to="/login" />
    }}
  </ApolloConsumer>
);






