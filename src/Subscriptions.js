import gql from 'graphql-tag';

export const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription {
    newMessage {
        id
        text
        created_at
        sentBy
    }
  }
`;

