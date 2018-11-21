import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import { CREATE_MESSAGE } from '../Mutations';
import { FEED_MESSAGES } from '../Queries';
import { NEW_MESSAGE_SUBSCRIPTION} from "../Subscriptions";

export class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    }
  }

  subscribeToNewMessages(subscribeToMore) {
    subscribeToMore({
        document: NEW_MESSAGE_SUBSCRIPTION,
        updateQuery:
          (prev, {subscriptionData}) => {
            if (!subscriptionData.data) {
              return prev;
            }
            const newMessage = subscriptionData.data.newMessage;
            // return Object.assign({}, prev, {
            //   messages: [...prev.messages, newMessage]
            // });

            // es6 syntax
            return {
              ...prev,
              messages: [...prev.messages, newMessage]
            };
          }
      })
    }

  render() {
    const { text } = this.state;
    return (
      <section>
        <input type="text" placeholder="Send a message..." value={text} onChange={e => this.setState({text: e.target.value})}/>
        {/*<input type="text" placeholder="username" value={username} onChange={e => this.setState({username: e.target.value})}/>*/}
        <Mutation mutation={CREATE_MESSAGE} variables={{ text }} update={(store, {data: {createMessage}}) => {
          const currentStoreState = store.readQuery({query: FEED_MESSAGES});
          const newStoreState = [...currentStoreState.messages, createMessage];
          store.writeQuery({
            query: FEED_MESSAGES,
            data: {messages: newStoreState}
          })
        }}>
          {parsedLink => <button onClick={parsedLink}>Create Message</button>}
        </Mutation>
        <Query query={FEED_MESSAGES}>
          {({loading, error, data, refetch, subscribeToMore}) => {
            if (loading) return <div>Loading...</div>
            if (error) return <div>{error.message}</div>
            this.subscribeToNewMessages(subscribeToMore);
            refetch();

            return <div>
              {data.messages.map(message => <div>
                <p>{message.text}</p>
                {/*<p>{message.username}</p>*/}
              </div>)}
            </div>
          }}
        </Query>
      </section>
    );
  }
}
