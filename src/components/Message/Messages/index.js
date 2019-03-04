import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';

import MessageDelete from '../MessageDelete';
import Loading from '../../Loading';
import withSession from '../../Session/withSession';

const MESSAGE_CREATED = gql`
    subscription {
        messageCreated {
            message {
                id
                text
                createdAt
                user {
                    id
                    username
                }
                room {
                    id
                }
            }
        }
    }
`;

const GET_PAGINATED_MESSAGES_WITH_USERS = gql`
    query($cursor: String, $limit: Int!) {
        messages(cursor: $cursor, limit: $limit)
        @connection(key: "MessagesConnection") {
            edges {
                id
                text
                createdAt
                user {
                    id
                    username
                }
                room {
                    id
                }
            }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
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

const StyledMessage = styled.div`
  border-top: 5px solid ${props => props.theme.black};
  line-height: 1.5;
  display: grid;
  overflow: auto;
  padding: .25em;
`;

const StyledP = styled.p`
  word-wrap: break-word;
  width: 100%;
`;

const Messages = ({ limit, me, room }) => (
  <Query query={ GET_PAGINATED_MESSAGES_WITH_USERS } variables={{
    limit
  }}>
    {({ data, loading, error, fetchMore, subscribeToMore }) => {
      if (!data) {
        return (
          <div>
            No messages yet... (you're sure you signed in, right?)
          </div>
        );
      }

      const { messages } = data;

      if (loading || !messages) {
        return <Loading />;
      }

      const { edges, pageInfo } = messages;

      return (
        <Fragment>
          <MessageList
            messages={edges}
            me={me}
            room={room}
            subscribeToMore={subscribeToMore}
          />

          {pageInfo.hasNextPage && (
          <MoreMessagesButton
          limit={limit}
          pageInfo={pageInfo}
          fetchMore={fetchMore}
          >
          Get Older Messages
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
                              children
                            }) => (
  <StyledButton
    type="button"
    onClick={() =>
      fetchMore({
        variables: {
          cursor: pageInfo.endCursor,
          limit
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
                ...fetchMoreResult.messages.edges
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
      document: MESSAGE_CREATED,
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
              ...previousResult.messages.edges
            ],
          },
        };
      },
    });
  };

  componentDidMount() {
    this.subscribeToMoreMessages();
  }

  render() {
    const { messages, me } = this.props;
    return messages.map(message => (
      <MessageItem key={message.id} message={message} me={me} />
    ));
  }
}

const MessageItemBase = ({ message, session }) => (
  <StyledMessage>
  <h2>{message.user.username}</h2>
  <small>{message.createdAt}</small>
  <StyledP>{message.text}</StyledP>

    {session && session.me && message.user.id === session.me.id && (
    <MessageDelete message={message} />
    )}
  </StyledMessage>
);

const MessageItem = withSession(MessageItemBase);

export default Messages;

