import React from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import { StyledButton } from '../Messages';

const GET_PAGINATED_MESSAGES_QUERY = gql`
  query {
    messages(order: "DESC") @connection(key: "MessageConnection") {
      edges {
        id
        text
        createdAt
#        roomId
        user {
          id
          username
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

const DELETE_MESSAGE_MUTATION = gql`
    mutation($id: ID!) {
        deleteMessage(id: $id) {
          text
        }
    }
`;

const MessageDelete = ({ message }) => {
  const [deleteMessage] = useMutation(
    DELETE_MESSAGE_MUTATION,
    {
      variables: { id: message.id },
      update: client => {
        const data = client.readQuery({
          query: GET_PAGINATED_MESSAGES_QUERY,
        });

        client.writeQuery({
          query: GET_PAGINATED_MESSAGES_QUERY,
          data: {
            ...data,
            messages: {
              ...data.messages,
              edges: data.messages.edges.filter(
                node => node.id !== message.id,
              ),
              pageInfo: data.messages.pageInfo,
            },
          },
        });
      }
    }
  );

  return (
    <StyledButton type="button" onClick={deleteMessage}>
      Delete Message
    </StyledButton>
  );
};

export default MessageDelete;
