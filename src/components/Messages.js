import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import { CREATE_MESSAGE } from '../Mutations';
import { FEED_MESSAGES } from '../Queries';
import { NEW_MESSAGE_SUBSCRIPTION} from "../Subscriptions";

export class Messages extends Component{
  constructor(props){
    super(props);
    this.state = {
      body: '',
      user: ''
    }
  }
subscribeToNewMessages(subscribeToMore){
    subscribeToMore({
      document: NEW_MESSAGE_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if(!subscriptionData) return prev;
        const newMessage = subscriptionData.newMessage;
        return Object.assign({}, prev, {
          messages: [...prev.messages, newMessage]
        });
      }
    })
}

render() {
    const { body, user } = this.state;
    return (
      <section>
        <input type="text" placeholder="body" value={body} onChange={e => this.setState({body: e.target.value})} />
        <Mutation mutation={CREATE_MESSAGE} variables={{body, user}} update={(store, {data: {createMessage} }) => {
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
        {({ loading, error, data, refetch, subscribeToMore }) => {
        if(loading) return <div>Loading...</div>
          if(error) return <div>{error.message}</div>
          this.subscribeToNewMessages(subscribeToMore);
          refetch();

          return <div>
            {data.messages.map(message => <div>
              <p>{message.body}</p>
              <p>{message.user}</p>
                </div>)}

                </div>

        }}
      </Query>

      </section>
    );
}
}
