import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import MessageDelete from '../MessageDelete';
import Loading from '../../Loading';
import withSession from '../../Session/withSession';
import ErrorMessage from '../../Error';

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

const MESSAGE_CREATED_SUBSCRIPTION = gql`
  subscription messageCreatedSubscription {  
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

const GET_PAGINATED_MESSAGES_QUERY = gql`
  query getPaginatedMessagesQuery($cursor: String, $limit: Int!) {
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
              Get More Messages
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

  componentDidMount() {
  this.subscribeToMoreMessages();
}

componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

render() {
  const { messages } = this.props;

  const MessageItemBase = ({ message, session }) => (
    <StyledMessage>
      {session && session.me && message.user.id === session.me.id && (
        <MessageDelete message={message}/>
      )}
      <StyledP>Time: {message.createdAt}</StyledP>
      <StyledP>Username: {message.user.username}</StyledP>
      <StyledP>Message: {message.text}</StyledP>
    </StyledMessage>
  );

  const MessageItem = withSession(MessageItemBase);

  return messages.map(message => (
    <MessageItem key={message.id} message={message} />
    ));
}
}

export default Messages;







