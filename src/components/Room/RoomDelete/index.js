import React from 'react';
import { useMutation, gql } from '@apollo/client';
import styled from 'styled-components';

import ErrorMessage from '../../Error';
import Loading from '../../Loading';

const DELETE_ROOM_MUTATION = gql`
    mutation($id: ID!) {
        deleteRoom(id: $id)
    }
`;

const RoomDelete = ({ room }) => {
  const [deleteRoom, { data, loading, error }] = useMutation(DELETE_ROOM_MUTATION, {
    variables: { id: room.id },
    // No need for manual cache update - subscription will handle real-time updates
  });

  if (error) return <ErrorMessage error={error}/>;

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the room "${room.title}"?`)) {
      try {
        await deleteRoom();
      } catch (error) {
        console.error('Failed to delete room:', error);
      }
    }
  };

  return (
    <StyledDeleteButton 
      type="button" 
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? 'Deleting...' : 'Delete'}
    </StyledDeleteButton>
  );
};

const StyledDeleteButton = styled.button`
  padding: 5px 15px;
  font-size: 14px;
  font-weight: bold;
  font-family: RussellSquareStd, monospace;
  text-transform: uppercase;
  color: ${props => props.theme.white};
  background-color: #dc3545;
  border: 5px solid #dc3545;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background-color: #c82333;
    border-color: #bd2130;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default RoomDelete;
