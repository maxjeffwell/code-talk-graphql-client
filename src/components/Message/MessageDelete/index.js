import React from 'react';
import { Mutation, withApollo } from 'react-apollo';
import gql from 'graphql-tag';

import { StyledButton } from '../Messages';

const GET_PAGINATED_MESSAGES_QUERY = gql`
  query getPaginatedMessagesQuery { 
    messages(order: "DESC") @connection(key: "MessageConnection") {
      edges {
        id
        text
        createdAt
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
    mutation deleteMessageMutation($id: ID!) {
        deleteMessage(id: $id)
    }
`;

const MessageDelete = ({ message }) => <Mutation
  mutation={DELETE_MESSAGE_MUTATION}
  variables={{ id: message.id }}
  update={client => {
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
  }}
>
  {(deleteMessage) => <StyledButton type="button" onClick={deleteMessage}>
    Delete Message
  </StyledButton>
  }
</Mutation>;

export default withApollo(MessageDelete);
