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

const MESSAGE_CREATED_SUBSCRIPTION = gql`
    subscription($roomId: ID!) {
        messageCreated(roomId: $roomId) {
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

const Messages = ({ roomId })  => (
  <Query query={ GET_PAGINATED_MESSAGES_BY_ROOM_QUERY } variables={{
    roomId
  }}>
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
        return <Loading loading={loading} />;
      }
      if (error) {
        return <ErrorMessage error={error} />;
      }

      return (
        <Fragment>
          <MessageList
            messages={messages}
            roomId={roomId}
            subscribeToMore={subscribeToMore}
          />
        </Fragment>
      );
    }}
  </Query>
);

class MessageList extends Component {
  state = {
    hasMoreItems: true,
  };
  subscribeToMoreMessages = roomId =>
    this.props.subscribeToMore({
      document: MESSAGE_CREATED_SUBSCRIPTION,
      variables: {
        roomId,
      },
      updateQuery: (previousResult, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return previousResult;
        }
        const { messageCreated } = subscriptionData.data;
        return {
          ...previousResult,
          messages: [
            messageCreated.messages, ...previousResult.messages,
          ],
        };
      },
    });

  componentWillMount() {
    console.log('I AM GOING TO MOUNT');
    this.unsubscribe = this.subscribeToMoreMessages(this.props.roomId);
  }

  componentDidMount() {
    console.log('I DID MOUNT');
    this.subscribeToMoreMessages(this.props.roomId);
  }

  componentWillReceiveProps({ data: { messages }, roomId }) {
    if (this.props.roomId !== roomId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribeToMoreMessages(this.props.roomId);
    }

    if (
      this.scroller &&
      this.scroller.scrollTop < 20 &&
      this.props.data.messages &&
      messages &&
      this.props.data.messages.length !== messages.length
    ) {
      // 35 items
      const heightBeforeRender = this.scroller.scrollHeight;
      // wait for 70 items to render
      setTimeout(() => {
        if (this.scroller) {
          this.scroller.scrollTop = this.scroller.scrollHeight - heightBeforeRender;
        }
      }, 120);
    }
  }

  componentWillUnmount() {
    console.log('I UNMOUNTED');
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  handleScroll = () => {
    const { data: { messages, fetchMore }, roomId } = this.props;
    if (
      this.scroller &&
      this.scroller.scrollTop < 100 &&
      this.state.hasMoreItems &&
      messages.length >= 35
    ) {
      fetchMore({
        variables: {
          roomId,
          cursor: messages[messages.length - 1].createdAt,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }

          if (fetchMoreResult.messages.length < 35) {
            this.setState({ hasMoreItems: false });
          }

          return {
            ...previousResult,
            messages: [...previousResult.messages, ...fetchMoreResult.messages],
          };
        },
      });
    }
  };

  render() {
    const { messages } = this.props;
    return messages.map(message => (
      <MessageItem key={message.id} message={message} />
      ));
  }
}

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

export default Messages;







