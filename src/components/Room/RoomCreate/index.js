import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import styled from 'styled-components';

import ErrorMessage from '../../Error';
import Loading from '../../Loading';

const CREATE_ROOM = gql`
  mutation ($title: String!) {
      createRoom(title: $title) {
          title
          createdAt
      }
  }
`;

const RoomCreate = () => {
  const [title, setTitle] = useState('');
  
  const [createRoom, { data, loading, error }] = useMutation(CREATE_ROOM, {
    variables: { title },
    optimisticResponse: {
      createRoom: {
        title,
        __typename: 'Room',
      }
    }
  });

  const onChange = event => {
    const { name, value } = event.target;
    if (name === 'title') {
      setTitle(value);
    }
  };

  const onSubmit = async (event) => {
    try {
      event.preventDefault();
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
  margin-bottom: 20px;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 3px solid ${props => props.theme.green};
  background-color: ${props => props.theme.black};
  color: ${props => props.theme.green};
  
  &::placeholder {
    color: ${props => props.theme.green};
    opacity: 0.6;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 5px ${props => props.theme.green};
  }
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.black};
  background-color: ${props => props.theme.green};
  border: 3px solid ${props => props.theme.green};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.black};
    color: ${props => props.theme.green};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default RoomCreate;
