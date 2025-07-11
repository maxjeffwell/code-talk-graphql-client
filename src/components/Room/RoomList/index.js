import React, { useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';

import ErrorMessage from '../../Error';
// import { ROOMS } from '../../../constants/routes';
// import RoomCreate from '../RoomCreate';
// import RoomDelete from '../RoomDelete';
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

  if (!data) {
    return (
      <Fragment>
        <p>No rooms have been created yet ... Create one here ...</p>
        {/*<RoomCreate />*/}
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

  return rooms.map(room => <RoomListItem key={room.id} room={room}/>);
};

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
  <StyledRoomList>
    <li>
      {/*<StyledRoomLink to={`${ROOMS}/${room.id}`}>*/}
        {room.title}
      {/*</StyledRoomLink>*/}
      {/*<RoomDelete room={room} />*/}
    </li>
  </StyledRoomList>
);

export default Rooms;


