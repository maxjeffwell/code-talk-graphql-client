import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';

import { TYPE_CODE } from './mutations';
import { READ_CODE } from './queries';
import { TYPING_CODE_SUBSCRIPTION } from './subscriptions';


// import { Sidebar } from '../Sidebar';
// import Editor from '../CodeMirror';
import ErrorMessage from '../Error';

class Room extends Component {
  updateCode(e, typeCodeMutation) {
    const newCode = e.currentTarget.value;
    typeCodeMutation({ variables: { body: newCode } });
  }

  subscribeToNewCode(subscribeToMore) {
    subscribeToMore({
      document: TYPING_CODE_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        return Object.assign({}, prev, {
          readCode: subscriptionData.data.typingCode
        });
      }
    })
  }

  render() {
    return (
      <div>
          <Query query={READ_CODE}>
            {({ loading, error, data, subscribeToMore }) => {
              this.subscribeToNewCode(subscribeToMore);
              if (loading) return <div>Typing...</div>;
              if (error) return ErrorMessage;
              return <Mutation mutation={TYPE_CODE}>
                {typeCodeMutation => <textarea value={data.readCode.body}
                                               onChange={e => this.updateCode(e, typeCodeMutation)} />}
              </Mutation>
            }}
          </Query>
      </div>
    );
  }
}

export default Room;




