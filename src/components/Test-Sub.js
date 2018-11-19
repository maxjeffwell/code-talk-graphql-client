import React, { Component } from 'react';
import { Subscription } from 'react-apollo';
import gql from 'graphql-tag';

export const NEW_MESSAGE_SUBSCRIPTION = gql`    
    subscription {
      newMessage {
          text
          username
      }
  }
`;

export class TestSub extends Component {
    render() {
      return (
        <Subscription subscription={NEW_MESSAGE_SUBSCRIPTION}>
          {(data) => {
          console.log(data);
              return null;
          }}
        </Subscription>
      );
    }
}

