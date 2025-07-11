import React, { useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
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

// const CREATE_MESSAGE = gql`
//     mutation($text: String!, $roomId: ID!) {
//         createMessage(text: $text, roomId: $roomId){
//             id
//             createdAt
//             text
//         }
//     }
// `;

const CREATE_MESSAGE = gql`
  mutation($text: String!) {
    createMessage(text: $text){
      id
      createdAt
      text
    }
  }
`;

const MessageCreate = () => {
  const [text, setText] = useState('');
  const buttonRef = useRef(null);

  const [createMessage, { data, loading, error }] = useMutation(
    CREATE_MESSAGE,
    {
      variables: { text }
    }
  );

  const onChange = event => {
    const { value } = event.target;
    setText(value);
  };

  const onEnterPress = event => {
    if (event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault();
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await createMessage();
      setText('');
    } catch (err) {
      // Error is handled by the error state from useMutation
    }
  };

  const validateInput = () => {
    return !text;
  };

  return (
    <StyledForm onSubmit={onSubmit}>
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
          name="text" autoFocus
          value={text}
          onChange={onChange} onKeyDown={onEnterPress}
          placeholder="Type your messages here ..." required
          rows={2}
          maxRows={7}
        />
      </label>
      <StyledButton disabled={loading || validateInput()} type="submit" ref={buttonRef}>
        Send Message
      </StyledButton>

      {loading && <Loading />}
      {error && <ErrorMessage error={error} />}

    </StyledForm>
  );
};

export default MessageCreate;
