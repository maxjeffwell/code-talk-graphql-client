import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import TextareaAutosize from 'react-autosize-textarea';
import styled from 'styled-components';

import ErrorMessage from '../../Error';
import Loading from '../../Loading';

const StyledTextarea = styled(TextareaAutosize)`
  font-size: ${({ theme }) => theme.textarea.fontSize};
  font-family: ${({ theme }) => theme.textarea.fontFamily};
  font-weight: ${({ theme }) => theme.textarea.fontWeight};
  border: ${({ theme }) => theme.textarea.border};
  background-color: ${({ theme }) => theme.textarea.backgroundColor};
  color: ${({ theme}) => theme.textarea.color};
  resize: none;
  box-sizing: border-box;
  width: 100%;
  margin-top: 2px;
  padding: 3px 3px 3px 3px;
`;

const CREATE_MESSAGE = gql`
    mutation($text: String!, $roomId: ID!) {
        createMessage(text: $text, roomId: $roomId){
            id
            createdAt
            text
        }
    }
`;

class MessageCreate extends Component {
  state = {
    text: '',
    roomId: '',
  };

  componentDidMount() {
    this.setState({
      roomId: this.props.match.params.id
    });
  }

  onChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onEnterPress = event => {
    if (event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault();
      this.button.click();
    }
  };

  onSubmit = async (event, createMessage) => {
    event.preventDefault();

    try {
      await createMessage();
      this.setState({ text: ''});
    } catch (error) {}
  };

  validateInput = () => {
    const { text, roomId } = this.state;
    return !text || !roomId;
  };

  render() {
    const { text, roomId } = this.state;

    return (
      <Fragment>
      <Mutation
        mutation={CREATE_MESSAGE}
        variables={{ text, roomId }}
      >
        {(createMessage, { data, loading, error }) => (

          <form
            onSubmit={event => this.onSubmit(event, createMessage)}
          >

            <label htmlFor="Message Input">
            <StyledTextarea theme={{
              textarea: {
                fontSize: '1.2em',
                fontWeight: 'bold',
                border: '5px solid #30d403',
                backgroundColor: '#EDEDED',
                color: '#393939',
                fontFamily: 'SerpentineStd-Medium, monospace',
              }
            }} aria-label="textarea"
              name="text" autoFocus
              value={text}
              onChange={this.onChange} onKeyDown={this.onEnterPress}
              placeholder="Type your messages here ..." required
                            rows={2}
                            maxRows={7}
            />
            </label>
            <button disabled={loading || this.validateInput()} type="submit" ref={el => (this.button = el)}>
              Send
            </button>

            {loading && <Loading />}
            {error && <ErrorMessage error={error} />}

          </form>
        )}
      </Mutation>
      </Fragment>
    );
  }
}

export default withRouter(MessageCreate);
