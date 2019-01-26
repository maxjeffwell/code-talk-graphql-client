import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';

import { TYPE_CODE } from './mutations';
import { READ_CODE } from './queries';
import { TYPING_CODE_SUBSCRIPTION } from './subscriptions';

import ErrorMessage from '../Error';
import Loading from '../Loading';

const StyledTextarea = styled(TextareaAutosize)`
  font-size: ${({ theme }) => theme.textarea.fontSize};
  border: ${({ theme }) => theme.textarea.border};
  background-color: ${({ theme }) => theme.textarea.backgroundColor};
  color: ${({ theme}) => theme.textarea.color};
  resize: none;
  box-sizing: border-box;
  width: 100%;
`;

class Editor extends Component {
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
      <div className="editor">
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
                      fontSize: '25px',
                      border: '5px solid #30d403',
                      backgroundColor: '#393939',
                      color: '#30d403'
                    }
                  }} aria-label="textarea"
                                  value={data.readCode.body}
                                  onChange={e => this.updateCode(e, typeCodeMutation)}
                                  rows={50}
                  />
                </label>}
            </Mutation>
          }}
        </Query>
      </div>
    );
  }
}

export default Editor;
