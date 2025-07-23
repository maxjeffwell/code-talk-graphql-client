import React from 'react';
import { useMutation, gql } from '@apollo/client';

import { StyledButton } from '../Messages';

const GET_PAGINATED_MESSAGES_QUERY = gql`
  query($cursor: String, $limit: Int!) {
    messages(cursor: $cursor, limit: $limit)
    @connection(key: "MessageConnection") {
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
        endCursor
      }
    }
  }
`;

const GET_PAGINATED_MESSAGES_BY_ROOM_QUERY = gql`
  query($cursor: String, $limit: Int!, $roomId: ID!) {
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

const DELETE_MESSAGE_MUTATION = gql`
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

const MessageDelete = ({ message, roomId }) => {
  const [deleteMessage] = useMutation(
    DELETE_MESSAGE_MUTATION,
    {
      variables: { id: message.id },
      update: (cache, { data: mutationData }) => {
        if (!mutationData?.deleteMessage) return;
        
        console.log('Message deletion mutation completed, updating cache for message:', message.id);
        
        const query = roomId ? GET_PAGINATED_MESSAGES_BY_ROOM_QUERY : GET_PAGINATED_MESSAGES_QUERY;
        const queryVariables = roomId ? { limit: 10, roomId } : { limit: 10 };
        
        try {
          const existingData = cache.readQuery({
            query,
            variables: queryVariables,
          });
          
          if (existingData?.messages) {
            const filteredEdges = existingData.messages.edges.filter(
              node => node.id !== message.id,
            );
            
            console.log('Removing message from cache via mutation update. Before:', existingData.messages.edges.length, 'After:', filteredEdges.length);
            
            cache.writeQuery({
              query,
              variables: queryVariables,
              data: {
                ...existingData,
                messages: {
                  ...existingData.messages,
                  edges: filteredEdges,
                  pageInfo: existingData.messages.pageInfo,
                },
              },
            });

            // Force a cache update to ensure UI updates
            cache.evict({ id: `Message:${message.id}` });
            cache.gc();
          }
        } catch (error) {
          // Query might not exist in cache yet, that's okay
          console.log('Cache update failed, query not in cache:', error);
        }
      },
      optimisticResponse: {
        deleteMessage: {
          __typename: 'Message',
          id: message.id,
          text: message.text,
          user: message.user,
        },
      },
      // Force refetch after mutation completes to ensure UI consistency
      refetchQueries: [
        {
          query: roomId ? GET_PAGINATED_MESSAGES_BY_ROOM_QUERY : GET_PAGINATED_MESSAGES_QUERY,
          variables: roomId ? { limit: 10, roomId } : { limit: 10 },
        },
      ],
      // Force cache write after successful mutation
      awaitRefetchQueries: true,
    }
  );

  const handleDelete = async () => {
    console.log('Deleting message:', message.id, `"${message.text.substring(0, 30)}..."`);
    try {
      await deleteMessage();
      console.log('Message delete mutation completed');
    } catch (error) {
      console.error('Message delete mutation failed:', error);
    }
  };

  return (
    <StyledButton type="button" onClick={handleDelete}>
      Delete Message
    </StyledButton>
  );
};

export default MessageDelete;
