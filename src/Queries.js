import gql from 'graphql-tag';

export const FEED_MESSAGES = gql`
    query { 
        messages {
            text
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

// export const CHAT_ROOM_QUERY = gql`
//   query {
//       chatRooms {
//           id
//           name
//           description
//       }
//   }
// `;
