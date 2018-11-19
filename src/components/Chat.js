import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import { CREATE_MESSAGE } from '../Mutations';
import { FEED_MESSAGES } from '../Queries';
import { NEW_MESSAGE_SUBSCRIPTION} from "./Test-Sub";


export class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    }
  }

  componentDidMount() {
    this.subscribeToNewMessages = this.props.subscribeToMore({
      document: NEW_MESSAGE_SUBSCRIPTION,
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData) return prev;
        const newMessage = subscriptionData.data.message.node;
        return Object.assign({}, prev, {
          allMessages: [...prev.allMessages, newMessage]
        });
      },
      onError: (err) => console.error(err),
    })
  }


  render() {

    return (
      <section>
        <input type="text" placeholder="Send a message..." value={this.props.data} onChange={e => this.setState({data: e.target.value})}/>
        <Mutation mutation={CREATE_MESSAGE} update={(store, {data: {createMessage}}) => {
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
                <p>{message.data}</p>
              </div>)}
            </div>
          }}
        </Query>
      </section>
    );
  }
}
