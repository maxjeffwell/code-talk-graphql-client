import React from 'react';
import { useMutation, gql } from '@apollo/client';
import styled from 'styled-components';

import ErrorMessage from '../../Error';
import Loading from '../../Loading';

// Temporarily disabled - server doesn't support rooms query
// const GET_ALL_ROOMS_QUERY = gql`
//     query {
//         rooms(order: "DESC") 
//         @connection(key: "RoomsConnection") {
//             edges {
//                 id
//             }
//             pageInfo {
//                 hasNextPage
//             }
//         }
//     }
// `;

const DELETE_ROOM_MUTATION = gql`
    mutation($id: ID!) {
        deleteRoom(id: $id)
    }
`;

const RoomDelete = ({ room }) => {
  // Temporarily disabled - server doesn't support rooms query
  // const [deleteRoom, { data, loading, error }] = useMutation(DELETE_ROOM_MUTATION, {
  //   variables: { id: room.id },
  //   update: (cache) => {
  //     const data = cache.readQuery({
  //       query: GET_ALL_ROOMS_QUERY,
  //     });

  //     cache.writeQuery({
  //       query: GET_ALL_ROOMS_QUERY,
  //       data: {
  //         ...data,
  //         rooms: {
  //           ...data.rooms,
  //           edges: data.rooms.edges.filter(
  //             node => node.id !== room.id,
  //           ),
  //           pageInfo: data.rooms.pageInfo,
  //         },
  //       },
  //     });
  //   }
  // });

  // if (error) return <ErrorMessage error={error}/>;

  // if (loading) return <Loading />;

  return (
    <StyledDeleteButton type="button" disabled={true}>
      Delete (Disabled)
    </StyledDeleteButton>
  );
};

const StyledDeleteButton = styled.button`
  padding: 5px 10px;
  font-size: 14px;
  color: ${props => props.theme.white};
  background-color: #dc3545;
  border: 2px solid #dc3545;
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
