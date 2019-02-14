import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import ErrorMessage from '../../Error';

const GET_ALL_MESSAGES_WITH_USERS = gql`
    query {
        messages(order: "DESC") @connection(key: "MessagesConnection") {
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

const DELETE_MESSAGE = gql`
    mutation($id: ID!) {
        deleteMessage(id: $id)
    }
`;

const MessageDelete = ({ message }) => (
  <Mutation
    mutation={DELETE_MESSAGE}
    variables={{ id: message.id }}
    update={cache => {
      const data = cache.readQuery({
        query: GET_ALL_MESSAGES_WITH_USERS,
      });

      cache.writeQuery({
        query: GET_ALL_MESSAGES_WITH_USERS,
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
    {(deleteMessage, { data, loading, error }) => {

      if (error) return <ErrorMessage error={error}/>;

      return <button type="button" onClick={deleteMessage}>
        Delete Message
      </button>
    }}
  </Mutation>
);

export default MessageDelete;
