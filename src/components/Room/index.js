import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';

import { TYPE_CODE } from './mutations';
import { READ_CODE } from './queries';
import { TYPING_CODE_SUBSCRIPTION } from './subscriptions';

import { Sidebar } from '../Sidebar';
import ErrorMessage from '../Error';
import Loading from '../Loading';

// import 'froala-editor/js/froala_editor.pkgd.min.js';
// import 'froala-editor/css/froala_style.min.css';
// import 'froala-editor/css/froala_editor.pkgd.min.css';
// import 'font-awesome/css/font-awesome.css';

// import FroalaEditor from 'react-froala-wysiwyg';

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
      <div className="chat-editor">
        <Sidebar />
          <Query query={READ_CODE}>
            {({ loading, error, data, subscribeToMore }) => {
              this.subscribeToNewCode(subscribeToMore);
              if (loading) return <Loading />;
              if (error) return ErrorMessage;
              return <Mutation mutation={TYPE_CODE}>
                {typeCodeMutation =>
                  <label>
                  <textarea aria-label="textarea" value={data.readCode.body}
                            onChange={e => this.updateCode(e, typeCodeMutation)}
                   />
                  </label>}
              </Mutation>
            }}
          </Query>
      </div>
    );
  }
}

export default Room;





