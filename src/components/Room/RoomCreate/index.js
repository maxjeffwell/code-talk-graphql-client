import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import styled from 'styled-components';

import ErrorMessage from '../../Error';

const CREATE_ROOM = gql`
  mutation ($title: String!) {
      createRoom(title: $title) {
          id
          title
      }
  }
`;


const RoomCreate = () => {
  const [title, setTitle] = useState('');
  
  const [createRoom, { loading, error }] = useMutation(CREATE_ROOM, {
    variables: { title },
    // Don't update cache here - the subscription will handle it
    // This prevents duplicate rooms from appearing
  });

  const onChange = event => {
    const { name, value } = event.target;
    if (name === 'title') {
      setTitle(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (title.trim()) {
        await createRoom();
        setTitle('');
      }
    } catch (error) {}
  };

  return (
    <StyledForm onSubmit={onSubmit}>
      <StyledInput 
        type="text"
        name="title"
        value={title}
        onChange={onChange}
        autoComplete="off"
        placeholder="Create a new room..."
        required
      />
      <StyledButton type="submit" disabled={loading || !title.trim()}>
        {loading ? 'Creating...' : 'Create Room'}
      </StyledButton>

      {error && <ErrorMessage error={error} />}
    </StyledForm>
  );
};

const StyledForm = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  padding: 20px;
  background: ${props => props.theme.black};
  border: 2px solid ${props => props.theme.green};
  border-radius: 5px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 12px 15px;
  font-size: 16px;
  font-family: RussellSquareStd, monospace;
  border: 2px solid ${props => props.theme.green};
  border-radius: 5px;
  background-color: ${props => props.theme.black};
  color: ${props => props.theme.green};
  
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

const StyledButton = styled.button`
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  font-family: RussellSquareStd, monospace;
  text-transform: uppercase;
  color: ${props => props.theme.black};
  background-color: ${props => props.theme.green};
  border: 2px solid ${props => props.theme.green};
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.black};
    color: ${props => props.theme.green};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export default RoomCreate;
