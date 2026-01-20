import React from 'react';
import { useMutation } from '@apollo/client';

import { StyledButton } from '../Messages';
import {
  GET_PAGINATED_MESSAGES_QUERY,
  DELETE_MESSAGE_MUTATION,
} from '../queries';

const MessageDelete = ({ message, roomId }) => {
  const queryVariables = { limit: 10, roomId: roomId || null };

  const [deleteMessage] = useMutation(
    DELETE_MESSAGE_MUTATION,
    {
      variables: { id: message.id },
      update: (cache, { data: mutationData }) => {
        if (!mutationData?.deleteMessage) return;

        console.log('Message deletion mutation completed, updating cache for message:', message.id);

        try {
          const existingData = cache.readQuery({
            query: GET_PAGINATED_MESSAGES_QUERY,
            variables: queryVariables,
          });

          if (existingData?.messages) {
            const filteredEdges = existingData.messages.edges.filter(
              node => node.id !== message.id,
            );

            console.log('Removing message from cache. Before:', existingData.messages.edges.length, 'After:', filteredEdges.length);

            cache.writeQuery({
              query: GET_PAGINATED_MESSAGES_QUERY,
              variables: queryVariables,
              data: {
                ...existingData,
                messages: {
                  ...existingData.messages,
                  edges: filteredEdges,
                },
              },
            });

            cache.evict({ id: `Message:${message.id}` });
            cache.gc();
          }
        } catch (error) {
          console.log('Cache update skipped, query not in cache:', error.message);
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
