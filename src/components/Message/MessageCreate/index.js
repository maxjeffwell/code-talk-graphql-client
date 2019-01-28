import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import TextareaAutosize from 'react-autosize-textarea';

import ErrorMessage from '../../Error';
import styled from 'styled-components';

const StyledTextarea = styled(TextareaAutosize)`
  font-size: ${({ theme }) => theme.textarea.fontSize};
  font-family: ${({ theme }) => theme.textarea.fontFamily};
  border: ${({ theme }) => theme.textarea.border};
  background-color: ${({ theme }) => theme.textarea.backgroundColor};
  color: ${({ theme}) => theme.textarea.color};
  resize: none;
  box-sizing: border-box;
  width: 100%;
`;


const CREATE_MESSAGE = gql`
    mutation($text: String!) {
        createMessage(text: $text) {
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
`;

class MessageCreate extends Component {
  state = {
    text: '',
  };

  onChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onSubmit = async (event, createMessage) => {
    event.preventDefault();

    try {
      await createMessage();
      this.setState({ text: '' });
    } catch (error) {}
  };

  render() {
    const { text } = this.state;

    return (
      <Mutation
        mutation={CREATE_MESSAGE}
        variables={{ text }}
      >
        {(createMessage, { data, loading, error }) => (
          <form
            onSubmit={event => this.onSubmit(event, createMessage)}
          >
            <label htmlFor="Message Input">
            <StyledTextarea theme={{
              textarea: {
                fontSize: '16px',
                border: '5px solid #30d403',
                backgroundColor: '#EDEDED',
                color: '#393939',
                fontFamily: 'SerpentineStd-Medium, monospace',
              }
            }} aria-label="textarea"
              name="text" autoFocus
              value={text}
              onChange={this.onChange}
              placeholder="Type your message here ..."
                            required
                            rows={3}
                            maxRows={7}
            />
            </label>
            <button type="submit">Send</button>

            {error && <ErrorMessage error={error} />}
          </form>
        )}
      </Mutation>
    );
  }
}

export default MessageCreate;
