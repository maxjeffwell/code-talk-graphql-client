import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';
import gql from 'graphql-tag';

import ErrorMessage from '../Error';
import Loading from '../Loading';

export const TYPE_CODE = gql`
    mutation TypeCodeMutation($body: String!){
        typeCode(code: {body: $body}) {
            body
        }
    }
`;

export const READ_CODE = gql`{
    readCode {
        body
    }
}
`;

export const TYPING_CODE_SUBSCRIPTION = gql`
    subscription {
        typingCode {
            body
        }
    }
`;

const StyledTextarea = styled(TextareaAutosize)`
  font-size: ${({ theme }) => theme.textarea.fontSize};
  border: ${({ theme }) => theme.textarea.border};
  background-color: ${({ theme }) => theme.textarea.backgroundColor};
  color: ${({ theme}) => theme.textarea.color};
  resize: none;
  box-sizing: border-box;
  width: 100%;
  margin-right: 50px;
  padding: 10px 10px 10px 10px;
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
                      fontSize: '1.2em',
                      border: '5px solid #30d403',
                      backgroundColor: '#393939',
                      color: '#30d403',
                    }
                  }} aria-label="textarea"
                                  value={data.readCode.body}
                                  placeholder="Collaborate on code here ..."
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
