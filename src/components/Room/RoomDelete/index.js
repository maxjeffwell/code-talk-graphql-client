import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorMessage from '../../Message/MessageDelete';

const GET_ALL_ROOMS = gql`
    query {
        rooms(order: "DESC") @connection(key: "RoomsConnection") {
            edges {
                id
                createdAt
            }
            pageInfo {
                hasNextPage
            }
        }
    }
`;

const DELETE_ROOM = gql`
    mutation($id: ID!) {
        deleteRoom(id: $id)
    }
`;

const RoomDelete = ({ room }) => (
  <Mutation
    mutation={DELETE_ROOM}
    variables={{ id: room.id }}
    update={cache => {
      const data = cache.readQuery({
        query: GET_ALL_ROOMS,
      });

      cache.writeQuery({
        query: GET_ALL_ROOMS,
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
    }}
  >
    {(deleteRoom, { data, loading, error }) => {

      if (error) return <ErrorMessage error={error}/>;

      return <button type="button" onClick={deleteRoom}>
        Delete Room
      </button>
    }}
  </Mutation>
);

export default RoomDelete;
