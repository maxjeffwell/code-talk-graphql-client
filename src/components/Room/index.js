import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

// import { Sidebar } from '../Sidebar';
// import Editor from '../CodeMirror';
import ErrorMessage from '../Error';

const TYPING_CODE_SUBSCRIPTION = gql` 
    subscription {
        typingCode {
            body
        }
    }
`;

const READ_CODE = gql`
    readCode {
        body
    }
`;

const TYPE_CODE = gql`
  mutation TypeCodeMutation($body: String!) {
      typeCode(code: {body: $body}) {
          body
      }
  }
`;

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
      <div className="Room">
        <header className="Room-header">
          <h1>Code Talk Editor</h1>
        </header>
        <main>
          <Query query={READ_CODE}>
            {({ loading, error, data, subscribeToMore }) => {
              this.subscribeToNewCode(subscribeToMore);
              if (loading) return <div>Typing...</div>;
              if (error) return ErrorMessage;
              return <Mutation mutation={TYPE_CODE}>
                {typeCodeMutation => <textarea value={data.readCode.body}
                                               onChange={e => this.updateCode(e, typeCodeMutation)}/>}
              </Mutation>
            }}
          </Query>
        </main>
      </div>
    );
  }
}

export default Room;




