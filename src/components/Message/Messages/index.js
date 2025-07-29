import React, { useEffect, Fragment, memo, useMemo } from 'react';
import styled from 'styled-components';
import { useQuery, useSubscription } from '@apollo/client';
import { gql } from '@apollo/client';

import MessageDelete from '../MessageDelete';
import withSession from '../../Session/withSession';
import ErrorMessage from '../../Error';
import { MessageSkeleton } from '../../Loading/SkeletonLoader';

const StyledMessage = styled.li`
    background: ${props => props.theme.black};
    border: 2px solid ${props => props.theme.green};
    border-radius: 5px;
    margin: 10px 0;
    padding: 15px;
    list-style: none;
    
    &:hover {
      border-color: ${props => props.theme.green};
      box-shadow: 0 0 10px rgba(48, 212, 3, 0.3);
    }
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
    line-height: 1.4;
    margin: 8px 0;
    color: ${props => props.theme.green};
    font-family: RussellSquareStd, monospace;
    
    &:first-child {
      font-weight: bold;
      font-size: 1.1em;
    }
    
    &:last-child {
      font-size: 0.9em;
      opacity: 0.8;
    }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  > div {
    color: ${props => props.theme.green};
    text-align: center;
    padding: 20px;
    font-family: RussellSquareStd, monospace;
  }
`;

const MESSAGE_CREATED_SUBSCRIPTION = gql`
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

const GET_PAGINATED_MESSAGES_QUERY = gql`
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

const Messages = memo(({ limit, roomId }) => {
  const query = GET_PAGINATED_MESSAGES_QUERY;
  const variables = { limit, roomId: roomId || null };
  
  console.log('[Messages Component] Rendering with:', {
    roomId: roomId || 'null (global)',
    variables
  });
  
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

  // Sort messages by createdAt in descending order (newest first)
  const sortedMessages = [...edges].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <MessagesContainer>
      <MessageList
        messages={sortedMessages}
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
    </MessagesContainer>
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
          roomId: roomId || null,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }

          // Combine and sort all messages
          const allEdges = [
            ...fetchMoreResult.messages.edges,
            ...previousResult.messages.edges,
          ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          return {
            messages: {
              ...fetchMoreResult.messages,
              edges: allEdges,
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
    console.log('[MessageList] Setting up subscription for roomId:', roomId);
    return subscribeToMore({
      document: MESSAGE_CREATED_SUBSCRIPTION,
      variables: { roomId: roomId || null },
      updateQuery: (previousResult, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return previousResult;
        }

        const { messageCreated } = subscriptionData.data;
        const newMessage = messageCreated.message;
        
        console.log('[MessageList Subscription] New message received:', {
          messageId: newMessage.id,
          messageRoomId: newMessage.roomId,
          currentRoomId: roomId,
          previousEdgesCount: previousResult?.messages?.edges?.length || 0
        });
        
        // Server-side filtering is now handling room isolation
        // Messages will only be received for the subscribed room

        // Check if message already exists to prevent duplicates
        const messageExists = previousResult.messages.edges.some(
          message => message.id === newMessage.id
        );
        
        if (messageExists) {
          console.log('Message creation subscription: message already exists', newMessage.id, `"${newMessage.text.substring(0, 30)}..."`);
          return previousResult;
        }
        
        console.log('Message creation subscription: adding new message', newMessage.id, `"${newMessage.text.substring(0, 30)}..."`, 'from', newMessage.user.username);

        // Add new message and sort by createdAt
        const updatedEdges = [
          newMessage,
          ...previousResult.messages.edges,
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const updatedResult = {
          ...previousResult,
          messages: {
            ...previousResult.messages,
            edges: updatedEdges,
          },
        };
        
        console.log('[MessageList Subscription] Returning updated result with', updatedEdges.length, 'messages');
        return updatedResult;
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
      variables: roomId ? { roomId } : {},
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
  
  return (
    <ul>
      {messages.map((message, index) => (
        <MessageItem key={`${message.id}-${index}`} message={message} />
      ))}
    </ul>
  );
};

export default Messages;







