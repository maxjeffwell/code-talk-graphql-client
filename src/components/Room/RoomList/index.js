import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Loading from '../../Loading';
import { ROOMS } from '../../../constants/routes';
import RoomCreate from '../roomCreate';

const ROOM_CREATED = gql`
  subscription {
      roomCreated {
          room {
              id
              title
          }
      }
  }
`;

const GET_ALL_ROOMS_QUERY = gql`
  query GET_ALL_ROOMS_QUERY {
      rooms {
          id
          title
      }
  }
`;

const Rooms = ()  => (
  <Query query={ GET_ALL_ROOMS_QUERY }>
    {({ data, loading, error, subscribeToMore}) => {
      if (!data) {
        return (
          <div>
            <p>No rooms have been created yet...</p>
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
            rooms={rooms}
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
    return [
      <RoomCreate />,
      rooms.map(room => (
        <RoomListItem key={room.id} room={room}/>
      ))
    ];
        }
  }

  export const RoomListItem = ({ room }) =>
    <li>
      <Link to={`${ROOMS}/${room.id}`}>{room.title}</Link>
    </li>;

export default Rooms;


