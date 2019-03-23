import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import MessageDelete from '../MessageDelete';
import Loading from '../../Loading';
import withSession from '../../Session/withSession';
import ErrorMessage from '../../Error';

const StyledMessage = styled.div`
    border-top: 5px solid ${props => props.theme.black};
    line-height: 1.5;
    overflow: auto;
    grid-column: 3;
    grid-row: 2;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    flex-direction: column-reverse;
`;

export const StyledButton = styled.button`
  cursor: pointer;
  font-size: 1em;
  margin: 5px auto;
  padding: .25em;
  color: ${props => props.theme.green};
  background: ${props => props.theme.black};
  border-radius: 5px;
  border: 5px solid ${props => props.theme.green};
`;

const StyledP = styled.p`
    word-wrap: break-word;
    width: 100%;
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

const Messages = ({ limit })  => (
  <Query query={ GET_PAGINATED_MESSAGES_QUERY }
         variables={{ limit }}
  >
    {({ data, loading, error, fetchMore, subscribeToMore}) => {
      if (!data) {
        return (
          <div>
            <p>No messages have been created yet ... Create one here ...</p>
          </div>
        );
      }

      const { messages } = data;

      if (loading || !messages) {
        return <Loading />;
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
              More
            </MoreMessagesButton>
          )}
        </Fragment>
      );
    }}
  </Query>
);

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

class MessageList extends Component {
  subscribeToMoreMessages = () => {
    this.props.subscribeToMore({
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

  // componentWillMount() {
  //   this.unsubscribe = this.subscribeToMoreMessages();
  // }
//
//   componentWillReceiveProps({ roomId }) {
//     if (this.props.roomId !== roomId) {
//       if (this.unsubscribe) {
//         this.unsubscribe();
//       }
//       this.unsubscribe = this.subscribe(roomId);
//     }
//   }
//
  componentDidMount() {
  this.subscribeToMoreMessages();
}
//
  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

render() {
  const { messages } = this.props;

  const MessageItemBase = ({ message, session }) => (
    <StyledMessage>
      <h2>{message.user.username}</h2>
      <small>{message.createdAt}</small>
      <StyledP>{message.text}</StyledP>
      {session && session.me && message.user.id === session.me.id && (
        <MessageDelete message={message}/>
      )}
    </StyledMessage>
  );

  const MessageItem = withSession(MessageItemBase);

  return messages.map(message => (
    <MessageItem key={message.id} message={message} />
    ));
}
}

export default Messages;







