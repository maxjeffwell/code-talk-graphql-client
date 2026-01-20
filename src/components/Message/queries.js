import { gql } from '@apollo/client';

/**
 * Shared GraphQL queries, mutations, and subscriptions for Message components.
 * Centralizing these ensures consistent cache keys across components.
 */

export const GET_PAGINATED_MESSAGES_QUERY = gql`
  query($cursor: String, $limit: Int!, $roomId: ID) {
    messages(cursor: $cursor, limit: $limit, roomId: $roomId) {
      edges {
        id
        text
        createdAt
        roomId
        user {
          id
          username
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const MESSAGE_CREATED_SUBSCRIPTION = gql`
  subscription($roomId: ID) {
    messageCreated(roomId: $roomId) {
      message {
        id
        text
        createdAt
        roomId
        user {
          id
          username
        }
      }
    }
  }
`;

export const MESSAGE_DELETED_SUBSCRIPTION = gql`
  subscription {
    messageDeleted {
      id
      text
      createdAt
      roomId
      user {
        id
        username
      }
    }
  }
`;

export const DELETE_MESSAGE_MUTATION = gql`
  mutation($id: ID!) {
    deleteMessage(id: $id) {
      id
      text
      user {
        id
        username
      }
    }
  }
`;
