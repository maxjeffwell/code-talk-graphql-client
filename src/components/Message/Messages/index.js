import React, { useEffect, Fragment, memo, useMemo } from 'react';
import styled from 'styled-components';
import { useQuery, useSubscription } from '@apollo/client';
import { gql } from '@apollo/client';

import MessageDelete from '../MessageDelete';
import withSession from '../../Session/withSession';
import ErrorMessage from '../../Error';
import { MessageSkeleton } from '../../Loading/SkeletonLoader';

const StyledMessage = styled.li`
    border-top: 3px solid ${props => props.theme.black};
    margin: 5px auto;
    line-height: 1;
    overflow: auto;
    grid-column: 3;
    grid-row: 2;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 5px;
    display: flex;
    flex-direction: column;
`;

export const StyledButton = styled.button`
  cursor: pointer;
  display: block;
  text-align: center;
  font-size: 1em;
  margin: 0 auto;
  padding: .25em;
  color: ${props => props.theme.green};
  background: ${props => props.theme.black};
  border-radius: 5px;
  border: 3px solid ${props => props.theme.green};
`;

const StyledP = styled.p`
    word-wrap: break-word;
    width: 100%;
    line-height: 1;
    margin: 5px auto;
`;

// const MESSAGE_CREATED_SUBSCRIPTION = gql`
//     subscription($roomId: ID!) {
//         messageCreated(roomId: $roomId) {
//           message {
//             id
//             text
//             createdAt
//             roomId
//             userId
//             user {
//               id
//               username
//             }
//           }
//         }
//     }
// `;

const MESSAGE_CREATED_SUBSCRIPTION = gql`
  subscription{
    messageCreated {
      message {
        id
        text
        createdAt
        user {
          id
          username
        }
      }
    }
  }
`;

const MESSAGE_DELETED_SUBSCRIPTION = gql`
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

const GET_PAGINATED_MESSAGES_BY_ROOM_QUERY = gql`
  query($cursor: String, $limit: Int!, $roomId: ID!) {
    messages(cursor: $cursor, limit: $limit, roomId: $roomId)
    @connection(key: "MessageConnection") {
      edges {
        id
        text
        createdAt
        roomId
        userId
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

const GET_PAGINATED_MESSAGES_QUERY = gql`
  query($cursor: String, $limit: Int!) {
    messages(cursor: $cursor, limit: $limit)
    @connection(key: "MessageConnection") {
      edges {
        id
        text
        createdAt
        #        roomId
        #        userId
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

const Messages = memo(({ limit, roomId }) => {
  const query = roomId ? GET_PAGINATED_MESSAGES_BY_ROOM_QUERY : GET_PAGINATED_MESSAGES_QUERY;
  const variables = roomId ? { limit, roomId } : { limit };
  
  const { data, loading, error, fetchMore, subscribeToMore } = useQuery(
    query,
    {
      variables
    }
  );

  const memoizedData = useMemo(() => {
    if (!data) {
      return null;
    }
    return data;
  }, [data]);

  if (!memoizedData) {
    return (
      <div>
        <p>No messages have been created yet ... Create one here ...</p>
      </div>
    );
  }

  const { messages } = memoizedData;

  if (loading || !messages) {
    return (
      <div>
        {Array.from({ length: 3 }).map((_, index) => (
          <MessageSkeleton key={index} />
        ))}
      </div>
    );
  }
  if (error) {
    return <ErrorMessage error={error} />;
  }

  const { edges, pageInfo } = messages;

  return (
    <Fragment>
      <MessageList
        messages={edges}
        subscribeToMore={subscribeToMore}
        roomId={roomId}
      />
      {pageInfo.hasNextPage && (
        <MoreMessagesButton
          limit={limit}
          pageInfo={pageInfo}
          fetchMore={fetchMore}
          roomId={roomId}
        >
          Get More Messages
        </MoreMessagesButton>
      )}
    </Fragment>
  );
});

Messages.displayName = 'Messages';

const MoreMessagesButton = ({
                              limit,
                              pageInfo,
                              fetchMore,
                              roomId,
                              children,
                            }) => (
  <StyledButton
    type="button"
    onClick={() =>
      fetchMore({
        variables: {
          cursor: pageInfo.endCursor,
          limit,
          ...(roomId && { roomId }),
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }

          return {
            messages: {
              ...fetchMoreResult.messages,
              edges: [
                ...fetchMoreResult.messages.edges,
                ...previousResult.messages.edges,
              ],
            },
          };
        },
      })
    }
  >
    {children}
  </StyledButton>
);

const MessageList = ({ messages, subscribeToMore, roomId }) => {
  // Note: Using subscribeToMore for message deletions to ensure proper integration

  const subscribeToMoreMessages = () => {
    return subscribeToMore({
      document: MESSAGE_CREATED_SUBSCRIPTION,
      updateQuery: (previousResult, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return previousResult;
        }

        const { messageCreated } = subscriptionData.data;
        const newMessage = messageCreated.message;
        
        // If we're in a room-specific view, only handle creations for this room
        if (roomId && newMessage.roomId && newMessage.roomId !== roomId) {
          return previousResult;
        }
        
        // If we're in general view, only handle creations for messages without roomId
        if (!roomId && newMessage.roomId) {
          return previousResult;
        }

        // Check if message already exists to prevent duplicates
        const messageExists = previousResult.messages.edges.some(
          message => message.id === newMessage.id
        );
        
        if (messageExists) {
          console.log('Message creation subscription: message already exists', newMessage.id, `"${newMessage.text.substring(0, 30)}..."`);
          return previousResult;
        }
        
        console.log('Message creation subscription: adding new message', newMessage.id, `"${newMessage.text.substring(0, 30)}..."`, 'from', newMessage.user.username);

        return {
          ...previousResult,
          messages: {
            ...previousResult.messages,
            edges: [
              newMessage,
              ...previousResult.messages.edges,
            ],
          },
        };
      },
      onError: (error) => {
        console.error('Message creation subscription error:', error);
      },
    });
  };

  // Message deletion subscription is now handled above

  const subscribeToMessageDeletions = () => {
    console.log('Setting up message deletion subscription for roomId:', roomId);
    return subscribeToMore({
      document: MESSAGE_DELETED_SUBSCRIPTION,
      updateQuery: (previousResult, { subscriptionData }) => {
        console.log('Message deletion subscription triggered:', subscriptionData);
        
        if (!subscriptionData?.data?.messageDeleted) {
          console.log('No deletion subscription data or messageDeleted field');
          return previousResult;
        }

        const { messageDeleted } = subscriptionData.data;
        console.log('Message deleted via subscription:', {
          id: messageDeleted.id,
          text: messageDeleted.text?.substring(0, 30) + '...',
          roomId: messageDeleted.roomId,
          username: messageDeleted.user?.username
        });
        
        // Room filtering logic
        if (roomId && messageDeleted.roomId && messageDeleted.roomId !== roomId) {
          console.log('Ignoring deletion - different room. Expected:', roomId, 'Got:', messageDeleted.roomId);
          return previousResult;
        }
        
        if (!roomId && messageDeleted.roomId) {
          console.log('Ignoring deletion - room message in general view');
          return previousResult;
        }

        // Safety check for messages structure
        if (!previousResult?.messages?.edges) {
          console.log('No messages in previousResult');
          return previousResult;
        }

        // Filter out the deleted message from the cache
        const filteredEdges = previousResult.messages.edges.filter(
          message => message.id !== messageDeleted.id
        );
        
        // Only update if something was actually removed
        if (filteredEdges.length === previousResult.messages.edges.length) {
          console.log('Message deletion subscription: message not found in cache', messageDeleted.id);
          return previousResult;
        }
        
        console.log('Message deletion subscription: removing message', messageDeleted.id, 'from', messageDeleted.user?.username);
        console.log('Messages count - Before:', previousResult.messages.edges.length, 'After:', filteredEdges.length);

        const updatedResult = {
          ...previousResult,
          messages: {
            ...previousResult.messages,
            edges: filteredEdges,
          },
        };
        
        console.log('Subscription returning updated result with', updatedResult.messages.edges.length, 'messages');
        return updatedResult;
      },
      onError: (error) => {
        console.error('Message deletion subscription error:', error);
        console.error('Subscription will attempt to reconnect automatically');
      },
    });
  };

  useEffect(() => {
    let unsubscribeCreated;
    let unsubscribeDeleted;
    
    try {
      unsubscribeCreated = subscribeToMoreMessages();
      unsubscribeDeleted = subscribeToMessageDeletions();
      console.log('Message subscriptions set up for roomId:', roomId);
    } catch (error) {
      console.error('Failed to set up message subscriptions:', error);
    }
    
    return () => {
      try {
        if (unsubscribeCreated && typeof unsubscribeCreated === 'function') {
          unsubscribeCreated();
        }
        if (unsubscribeDeleted && typeof unsubscribeDeleted === 'function') {
          unsubscribeDeleted();
        }
      } catch (error) {
        console.error('Failed to unsubscribe from message subscriptions:', error);
      }
    };
  }, [subscribeToMore, roomId]);

  const MessageItemBase = memo(({ message, session }) => {
    const isOwner = useMemo(() => 
      session && session.me && message.user.id === session.me.id, 
      [session, message.user.id]
    );

    return (
      <StyledMessage>
        <StyledP>Username: {message.user.username}</StyledP>
        <StyledP>Message: {message.text}</StyledP>
        <StyledP>Time: {message.createdAt}</StyledP>
        {isOwner && (
          <MessageDelete message={message} roomId={roomId}/>
        )}
      </StyledMessage>
    );
  });

  MessageItemBase.displayName = 'MessageItemBase';

  const MessageItem = withSession(MessageItemBase);

  // Note: We rely on cache-level deduplication rather than render-time filtering
  // This allows messages with duplicate content but different IDs to be displayed
  console.log('Message rendering - Total messages:', messages.length);
  
  return messages.map((message, index) => (
    <MessageItem key={`${message.id}-${index}`} message={message} />
  ));
};

export default Messages;







