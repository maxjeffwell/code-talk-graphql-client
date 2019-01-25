import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';

import { TYPE_CODE } from './mutations';
import { READ_CODE } from './queries';
import { TYPING_CODE_SUBSCRIPTION } from './subscriptions';

import { Sidebar } from '../Sidebar';
import ErrorMessage from '../Error';
import Loading from '../Loading';

const StyledTextarea = styled(TextareaAutosize)`
  font-size: ${({ theme }) => theme.textarea.fontSize};
  border-color: ${({ theme }) => theme.textarea.borderColor};
  resize: none;
  box-sizing: border-box;
  width: 100%;
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
                  <StyledTextarea theme={{
                    textarea: {
                      fontSize: '16px',
                      borderColor: 'green'
                    }
                  }} aria-label="textarea" value={data.readCode.body}
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





