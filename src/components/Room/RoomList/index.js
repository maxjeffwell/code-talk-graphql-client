import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';

import Loading from '../../Loading';
import ErrorMessage from '../../Error';
import { ROOMS } from '../../../constants/routes';
import RoomCreate from '../RoomCreate';
import RoomDelete from '../RoomDelete';

const ROOM_CREATED = gql`
  subscription {
      roomCreated {
          room {
              id
              title
              createdAt
          }
      }
  }
`;

const GET_PAGINATED_ROOMS = gql`
  query($cursor: String, $limit: Int) {
      rooms(cursor: $cursor, limit: $limit) 
      @connection(key: "RoomsConnection") {
          edges {
              id
              title
              createdAt
          }
          pageInfo {
              hasNextPage
              endCursor
          }
      }
  }
`;

const Rooms = ({ limit })  => (
  <Query query={ GET_PAGINATED_ROOMS } variables={limit}>
    {({ data, loading, error, fetchMore, subscribeToMore}) => {
      if (!data) {
        return (
          <Fragment>
            <p>No rooms have been created yet ... Create one here ...</p>
            <RoomCreate />
          </Fragment>
        );
      }

      const { rooms } = data;

      if (loading || !rooms) {
        return <Loading />;
      }

      if (error) {
        return <ErrorMessage error={error} />;
      }

      const { edges, pageInfo } = rooms;

      return (
        <Fragment>
          <RoomList
            rooms={edges}
            subscribeToMore={subscribeToMore}
          />

          {pageInfo.hasNextPage && (
            <GetMoreRoomsButton
              limit={limit}
              pageInfo={pageInfo}
              fetchMore={fetchMore}
            >
              Get More Rooms
            </GetMoreRoomsButton>
          )}
        </Fragment>
      );
    }}
  </Query>
);

const GetMoreRoomsButton = ({
  limit,
  pageInfo,
  fetchMore,
  children
}) => (
  <button
    type="button"
    onClick={() => fetchMore({
      variables: {
        cursor: pageInfo.endCursor,
        limit
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }

        return {
          rooms: {
            ...fetchMoreResult.rooms,
            edges: [
              ...previousResult.rooms.edges,
              ...fetchMoreResult.rooms.edges
            ],
          },
        };
      },
    })
    }
  >
    {children}
  </button>
);

class RoomList extends Component {
  subscribeToMoreRooms = () => {
    this.props.subscribeToMore({
      document: ROOM_CREATED,
      updateQuery: (previousResult, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return previousResult;
        }

        const { roomCreated } =subscriptionData.data;

        return {
          ...previousResult,
          rooms: {
            ...previousResult.rooms,
            edges: [
              roomCreated.room,
              ...previousResult.rooms.edges
            ],
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
    return [<RoomCreate />,
      rooms.map(room => (
      <RoomListItem key={room.key} room={room}/>
    ))
      ];
  }
}

const StyledRoomList = styled.ul`
  list-style-type: none;
  margin: 100px auto;
  width: 16.5%;
  &li {
  padding-left: 20px;
  }
`;

const StyledRoomLink = styled(Link)`
  color: ${props => props.theme.green};
  background-color: ${props => props.theme.black};
  border: 7px solid ${props => props.theme.green};
  border-radius: 5px;
  padding: 0 8px;
  height: auto;
  &:hover {
      text-decoration: underline;
  }
  font-weight: bold;
  font-size: 1.5em;
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;
  display: inline-block;
  white-space: nowrap;
`;

const RoomListItem = ({ room }) => (
  <StyledRoomList key={room.id}>
    <li>
      <StyledRoomLink to={`${ROOMS}/${room.id}`}>
        {room.title}
      </StyledRoomLink>
      <RoomDelete room={room} />
    </li>
  </StyledRoomList>
);

export default Rooms;


