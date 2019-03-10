import React, { Component } from 'react';
import styled from 'styled-components';
import { graphql } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import gql from 'graphql-tag';

import withSession from '../Session/withSession';
import { MessageCreate } from '../Message';
import MessageDelete from '../Message/MessageDelete';
import Loading from '../Loading';
import Landing from '../Landing';

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

const StyledP = styled.p`
    word-wrap: break-word;
    width: 100%;
`;
import { MessageCreate, Messagess } from '../Message';

const StyledSidebar = styled.div`
    border: 5px solid ${props => props.theme.black}; 
    margin: auto 1rem;
    height: auto;
    width: auto;
    display: grid;
    max-width: 600px;
    background: ${props => props.theme.white};
    color: ${props => props.theme.black};
    button {
      cursor: pointer;
      font-size: 1em;
      margin: 5px 5px 5px;
      padding: .25em 1em;
      color: ${props => props.theme.green};
      background: ${props => props.theme.black}; 
      border: 5px solid ${props => props.theme.green};
      border-radius: 5px;
    }
    button:hover {
      box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px      25px 0 rgba(0,0,0,0.19);
    }
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
                room {
                    id
                }
            }
        }
    }
`;

class MessageContainer extends Component {

  componentWillMount() {
    this.unsubscribe = this.subscribe(this.props.roomId);
  }

  componentWillReceiveProps({ roomId }) {
    if (this.props.roomId !== roomId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(roomId);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = roomId =>
    this.props.data.subscribeToMore({
      document: MESSAGE_CREATED_SUBSCRIPTION,
      variables: {
        roomId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }
        return {
          ...prev,
          messages: [...prev.messages, subscriptionData.messageCreated]
        };
      },
    });

  handleScroll = () => {
    const { data: { messages, fetchMore }, roomId } = this.props;
    if (
      this.scroller &&
      this.scroller.scrollTop < 100 &&
      this.state.hasMoreItems &&
      messages.length >= 15
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

          if (fetchMoreResult.messages.length < 10) {
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

  componentDidMount() {
  this.subscribeToMoreMessages();}
}

  render()
{
  const { data: { loading, messages, session, fetchMore, subscribeToMore,  me }, roomId } = this.props;
  const MessageItem = withSession(MessageItemBase);
  if(!data) {
    return (<div> No messages have been created yet.. You can create one here...</div>
    );
  }

  const { Messages } = data;}
  if (<Loading /> || !Messages) {
    <Redirect to="/" />;
  }

  const { edges, peageInfo } = Mesages;

