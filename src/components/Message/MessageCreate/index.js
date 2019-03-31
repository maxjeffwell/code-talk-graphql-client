import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import TextareaAutosize from 'react-autosize-textarea';
import styled from 'styled-components';

import ErrorMessage from '../../Error';
import Loading from '../../Loading';
import { StyledButton } from '../Messages';

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

const StyledForm = styled.form`
  margin-bottom: 5px;
`;

const CREATE_MESSAGE_MUTATION = gql`
  mutation ($text: String!) {
    createMessage(text: $text){
      id
      text
      createdAt
      user{
        id
        username
      }
    }
  }
`;

class MessageCreate extends Component {
  state = {
    text: ''
  };

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
      this.setState({text: ''});
    } catch(error) {}
  };

  validateInput = () => {
    const { text } = this.state;
    return !text;
  };

  render() {

    const { text } = this.state;

    return (
      <Mutation
        mutation={CREATE_MESSAGE_MUTATION}
        variables={{ text }}>

        {(createMessage, { data, loading, error }) => (

          <StyledForm
            onSubmit={event => this.onSubmit(event, createMessage)}
          >
            <label htmlFor="Message Input">
            <StyledTextarea theme={{
              textarea: {
                fontSize: '1em',
                border: '5px solid #30d403',
                backgroundColor: '#EDEDED',
                color: '#393939',
                fontFamily: 'SerpentineStd-Medium, monospace',
              }
            }} aria-label="textarea"
                            async={true}
              name="text" autoFocus
              value={text}
              onChange={this.onChange}
                            onKeyDown={this.onEnterPress}
                            placeholder="Type your messages here ..." required
                            rows={2}
                            maxRows={7}
            />
            </label>
            <StyledButton disabled={loading || this.validateInput()} type="submit" ref={el => (this.button = el)}>
              Send Message
            </StyledButton>

            {loading && <Loading />}
            {error && <ErrorMessage error={error} />}

          </StyledForm>
        )}
      </Mutation>
    );
  }
}

export default withRouter(MessageCreate);
