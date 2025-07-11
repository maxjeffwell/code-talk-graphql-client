import React from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import ErrorMessage from '../../Message/MessageDelete';
import Loading from '../../Loading';

const GET_ALL_ROOMS_QUERY = gql`
    query {
        rooms(order: "DESC") 
        @connection(key: "RoomsConnection") {
            edges {
                id
            }
            pageInfo {
                hasNextPage
            }
        }
    }
`;

const DELETE_ROOM_MUTATION = gql`
    mutation($id: ID!) {
        deleteRoom(id: $id)
    }
`;

const RoomDelete = ({ room }) => {
  const [deleteRoom, { data, loading, error }] = useMutation(DELETE_ROOM_MUTATION, {
    variables: { id: room.id },
    update: (cache) => {
      const data = cache.readQuery({
        query: GET_ALL_ROOMS_QUERY,
      });

      cache.writeQuery({
        query: GET_ALL_ROOMS_QUERY,
        data: {
          ...data,
          rooms: {
            ...data.rooms,
            edges: data.rooms.edges.filter(
              node => node.id !== room.id,
            ),
            pageInfo: data.rooms.pageInfo,
          },
        },
      });
    }
  });

  if (error) return <ErrorMessage error={error}/>;

  if (loading) return <Loading />;

  return (
    <button type="button" onClick={deleteRoom}>
      Delete Room
    </button>
  );
};

export default RoomDelete;
