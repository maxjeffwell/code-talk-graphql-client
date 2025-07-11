import React, { useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import styled from 'styled-components';

import ErrorMessage from '../../Error';
import RoomCreate from '../RoomCreate';
import RoomDelete from '../RoomDelete';
import Loading from '../../Loading';

const ROOM_CREATED_SUBSCRIPTION = gql`
  subscription {
      roomCreated {
          room {
              id
              title
          }
      }
  }
`;

const GET_PAGINATED_ROOMS_QUERY = gql`
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

const Rooms = ({ limit }) => {
  const { data, loading, error, fetchMore, subscribeToMore } = useQuery(GET_PAGINATED_ROOMS_QUERY, {
    variables: limit
  });

  if (loading || !data) {
    return <Loading />;
  }

  const { rooms } = data;

  if (!rooms || rooms.edges.length === 0) {
    return (
      <RoomsContainer>
        <h1>Chat Rooms</h1>
        <p>No rooms have been created yet. Create one below:</p>
        <RoomCreate />
      </RoomsContainer>
    );
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  const { edges, pageInfo } = rooms;

  return (
    <RoomsContainer>
      <h1>Chat Rooms</h1>
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
    </RoomsContainer>
  );
};

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

const RoomList = ({ rooms, subscribeToMore }) => {
  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: ROOM_CREATED_SUBSCRIPTION,
      updateQuery: (previousResult, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return previousResult;
        }

        const { roomCreated } = subscriptionData.data;

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

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [subscribeToMore]);

  // render() {
  //   const { rooms } = this.props;
  //   return [<RoomCreate />,
  //     rooms.map(room => (
  //     <RoomListItem key={room.id} room={room} />
  //   ))
  //     ];
  // }

  return (
    <StyledRoomList>
      <RoomCreate />
      {rooms.map(room => (
        <RoomListItem key={room.id} room={room} />
      ))}
    </StyledRoomList>
  );
};

const RoomsContainer = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
`;

const StyledRoomList = styled.ul`
  list-style-type: none;
  margin: 20px 0;
  padding: 0;
  li {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
  <li>
    <StyledRoomLink to={`/rooms/${room.id}`}>
      {room.title}
    </StyledRoomLink>
    <RoomDelete room={room} />
  </li>
);

export default Rooms;


