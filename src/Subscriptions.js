import gql from 'graphql-tag';

export const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription {
    newMessage {
        text
        username
    }
  }
`;

