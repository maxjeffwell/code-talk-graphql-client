import React, { useState, useRef } from 'react';
import { useMutation, gql } from '@apollo/client';
import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';

import ErrorMessage from '../../Error';
import Loading from '../../Loading';
import { StyledButton } from '../Messages';

const StyledTextarea = styled(TextareaAutosize)`
  font-size: 1rem;
  font-family: RussellSquareStd, monospace;
  font-weight: normal;
  border: 2px solid ${props => props.theme.green};
  background-color: ${props => props.theme.black};
  color: ${props => props.theme.green};
  resize: none;
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 10px;
  padding: 12px;
  border-radius: 5px;
  
  &::placeholder {
    color: ${props => props.theme.green};
    opacity: 0.7;
    font-family: RussellSquareStd, monospace;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(48, 212, 3, 0.3);
    border-color: ${props => props.theme.green};
  }
`;

const StyledForm = styled.form`
  padding: 1rem;
  border-bottom: 2px solid ${props => props.theme.green};
  background: ${props => props.theme.black};
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.green};
    font-family: RussellSquareStd, monospace;
    font-weight: bold;
  }
`;

const CREATE_MESSAGE_WITH_ROOM = gql`
    mutation($text: String!, $roomId: ID!) {
        createMessage(text: $text, roomId: $roomId){
            id
            createdAt
            text
            roomId
            user {
              id
              username
            }
        }
    }
`;

const CREATE_MESSAGE = gql`
  mutation($text: String!) {
    createMessage(text: $text){
      id
      createdAt
      text
      user {
        id
        username
      }
    }
  }
`;

const GET_PAGINATED_MESSAGES_QUERY = gql`
  query($cursor: String, $limit: Int!, $roomId: ID) {
    messages(cursor: $cursor, limit: $limit, roomId: $roomId) {
      edges {
        id
        text
        createdAt
        roomId
        user {
          id
          username
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const MessageCreate = ({ roomId }) => {
  const [text, setText] = useState('');
  const buttonRef = useRef(null);

  const mutation = roomId ? CREATE_MESSAGE_WITH_ROOM : CREATE_MESSAGE;
  const variables = roomId ? { text, roomId } : { text };
  
  const [createMessage, { loading, error }] = useMutation(
    mutation,
    {
      variables,
      update: (cache, { data: mutationData }) => {
        if (!mutationData?.createMessage) return;
        
        const newMessage = mutationData.createMessage;
        const query = GET_PAGINATED_MESSAGES_QUERY;
        const queryVariables = { limit: 10, roomId: roomId || null };
        
        console.log('[MessageCreate] Updating cache for', roomId ? `room ${roomId}` : 'general chat');
        
        try {
          const existingData = cache.readQuery({
            query,
            variables: queryVariables,
          });
          
          if (existingData?.messages) {
            // Check if message already exists to prevent duplicates (by ID only)
            const messageExists = existingData.messages.edges.some(
              message => message.id === newMessage.id
            );
            
            if (!messageExists) {
              // Add new message and sort by createdAt
              const updatedEdges = [newMessage, ...existingData.messages.edges]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
              
              cache.writeQuery({
                query,
                variables: queryVariables,
                data: {
                  ...existingData,
                  messages: {
                    ...existingData.messages,
                    edges: updatedEdges,
                  },
                },
              });
              console.log('Message creation mutation: added message to cache', newMessage.id, `"${newMessage.text.substring(0, 30)}..."`);
            } else {
              console.log('Message creation mutation: message already exists in cache', newMessage.id, `"${newMessage.text.substring(0, 30)}..."`);
            }
          } else {
            console.log('[MessageCreate] No existing messages in cache');
          }
        } catch (error) {
          // Query might not exist in cache yet, that's okay
          console.log('Cache update failed, query not in cache:', error);
        }
      },
      optimisticResponse: {
        createMessage: {
          __typename: 'Message',
          id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text,
          createdAt: new Date().toISOString(),
          ...(roomId && { roomId }),
          user: {
            __typename: 'User',
            id: 'temp-user',
            username: 'You',
          },
        },
      },
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
    return !text || text.trim().length === 0;
  };

  return (
    <StyledForm onSubmit={onSubmit}>
      <label htmlFor="message-input">
        <StyledTextarea 
          id="message-input"
          aria-label="Message input"
          name="text" 
          autoFocus
          value={text}
          onChange={onChange} 
          onKeyDown={onEnterPress}
          placeholder="Type your messages here ..." 
          required
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
