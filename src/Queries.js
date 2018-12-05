import gql from 'graphql-tag';

export const FEED_MESSAGES = gql`
    query { 
        messages {
            text
            user {
                username
            }
            createdAt
        }
    }
`;

export const CURRENT_USER = gql`
  query {
      currentUser {
          id
          email
          username
      }
  }
`;

export const INFO = gql`
  query {
      info
  }
`;

