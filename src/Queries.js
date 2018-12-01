import gql from 'graphql-tag';

export const FEED_MESSAGES = gql`
    query { 
        messages {
            id
            text
            created_at
            sentBy
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

