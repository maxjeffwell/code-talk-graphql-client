import gql from 'graphql-tag';

export const FEED_MESSAGES = gql`
    query { 
        messages {
            text
            username
        }
    }
`;

export const CHAT_ROOM_QUERY = gql`
  query {
      chatRooms {
          id
          name
          description
      }
  }
`;
