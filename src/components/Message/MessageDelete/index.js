import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import ErrorMessage from '../../Error';
import Loading from '../../Loading';

const GET_PAGINATED_MESSAGES_BY_ROOM_QUERY = gql`
    query ($cursor: String, $roomId: ID!) {
        messages(cursor: $cursor, roomId: $roomId){
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

const DELETE_MESSAGE_MUTATION = gql`
    mutation ($id: ID!) {
        deleteMessage(id: $id)
    }
`;

const MessageDelete = ({ message }) => (
  <Mutation
    mutation={DELETE_MESSAGE_MUTATION}
    variables={{ id: message.id }}
    update={cache => {
      const data = cache.readQuery({
        query: GET_PAGINATED_MESSAGES_BY_ROOM_QUERY,
      });

      cache.writeQuery({
        query: GET_PAGINATED_MESSAGES_BY_ROOM_QUERY,
        data: {
          ...data,
          messages: {
          ...data.messages.filter(
              node => node.id !== message.id,
            ),
          },
        },
      });
    }}
  >
    {(deleteMessage, { data, loading, error }) => {

      if (error) return <ErrorMessage error={error}/>;
      if (loading) return <Loading />;

      return <button type="button" onClick={deleteMessage}>
        Delete Message
      </button>
    }}
  </Mutation>
);

export default MessageDelete;
