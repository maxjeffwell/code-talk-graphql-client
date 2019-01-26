import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import AutosizeInput from 'react-input-autosize';

import ErrorMessage from '../../Error';

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
            <AutosizeInput type="text"
              name="text" autoFocus
              value={text}
              onChange={this.onChange}
              placeholder="Type your message here ..."
                         placeholderIsMinWidth
                         required
                         inputStyle={{
                           borderRadius: 5,
                           border: '5px solid #30d403',
                           fontSize: 16,
                           fontFamily: 'SerpentineStd-Medium, monospace',
                         }}
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
