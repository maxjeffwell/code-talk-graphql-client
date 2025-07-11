import React, { useEffect, Fragment, memo, useMemo } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
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
    flex-direction: column-reverse;
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

// const GET_PAGINATED_MESSAGES_BY_ROOM_QUERY = gql`
//   query($cursor: String, $limit: Int!, $roomId: ID!) {
//     messages(cursor: $cursor, limit: $limit, roomId: $roomId)
//     @connection(key: "MessageConnection") {
//       edges {
//         id
//         text
//         createdAt
//         roomId
//         userId
//         user {
//           id
//           username
//         }
//       }
//       pageInfo {
//         hasNextPage
//         endCursor
//       }
//     }
//   }
// `;

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

const Messages = memo(({ limit }) => {
  const { data, loading, error, fetchMore, subscribeToMore } = useQuery(
    GET_PAGINATED_MESSAGES_QUERY,
    {
      variables: { limit }
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
      />
      {pageInfo.hasNextPage && (
        <MoreMessagesButton
          limit={limit}
          pageInfo={pageInfo}
          fetchMore={fetchMore}
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
                              children,
                            }) => (
  <StyledButton
    type="button"
    onClick={() =>
      fetchMore({
        variables: {
          cursor: pageInfo.endCursor,
          limit,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }

          return {
            messages: {
              ...fetchMoreResult.messages,
              edges: [
                ...previousResult.messages.edges,
                ...fetchMoreResult.messages.edges,
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

const MessageList = ({ messages, subscribeToMore }) => {
  const subscribeToMoreMessages = () => {
    subscribeToMore({
      document: MESSAGE_CREATED_SUBSCRIPTION,
      updateQuery: (previousResult, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return previousResult;
        }

        const { messageCreated } = subscriptionData.data;

        return {
          ...previousResult,
          messages: {
            ...previousResult.messages,
            edges: [
              messageCreated.message,
              ...previousResult.messages.edges,
            ],
          },
        };
      },
    });
  };

  useEffect(() => {
    const unsubscribe = subscribeToMoreMessages();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [subscribeToMore]);

  const MessageItemBase = memo(({ message, session }) => {
    const isOwner = useMemo(() => 
      session && session.me && message.user.id === session.me.id, 
      [session, message.user.id]
    );

    return (
      <StyledMessage>
        {isOwner && (
          <MessageDelete message={message}/>
        )}
        <StyledP>Time: {message.createdAt}</StyledP>
        <StyledP>Username: {message.user.username}</StyledP>
        <StyledP>Message: {message.text}</StyledP>
      </StyledMessage>
    );
  });

  MessageItemBase.displayName = 'MessageItemBase';

  const MessageItem = withSession(MessageItemBase);

  return messages.map(message => (
    <MessageItem key={message.id} message={message} />
  ));
};

export default Messages;







