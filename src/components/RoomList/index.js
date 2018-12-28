import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Loading from '../Loading';

const ROOM_CREATED = gql`
  subscription {
      roomCreated {
          room {
              id
              name
              users {
                  id
                  username
              }
          }
      }
  }
`;

const GET_ALL_ROOMS_QUERY = gql`
  query GET_ALL_ROOMS_QUERY {
      rooms {
          id
          name
          users {
              id
              username
          }
      }
  }
`;

const Rooms = ()  => (
  <Query query={ GET_ALL_ROOMS_QUERY }>
    {({ data, loading, error, subscribeToMore}) => {
      if (!data) {
        return (
          <div>
            No rooms have been created yet...
          </div>
        );
      }

      const { rooms } = data;

      if (loading || !rooms) {
        return <Loading />;
      }

      return (
        <Fragment>
          <RoomList
            subscribeToMore={subscribeToMore}
          />
        </Fragment>
      );
        }
      }
  </Query>
);

class RoomList extends Component {
  subscribeToMoreRooms = () => {
    this.props.subscribeToMore({
      document: ROOM_CREATED,
      updateQuery: (previousResult, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return previousResult;
        }

        return {
          ...previousResult,
          rooms: {
            ...previousResult.rooms,
          },
        };
      },
    });
  };

  componentDidMount() {
    this.subscribeToMoreRooms();
  }

  render() {
    const { rooms } = this.props;
    return rooms.map(room => (
      <RoomListItem key={room.id} room={room} />
    ));
  }
}

export const RoomListItem = (room) =>
    <p>{room.name}</p>;


export default Rooms;












