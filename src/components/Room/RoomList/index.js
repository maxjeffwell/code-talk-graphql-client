import React, { useEffect, Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import styled from 'styled-components';
import { hasToken } from '../../../utils/auth';

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

const ROOM_DELETED_SUBSCRIPTION = gql`
  subscription {
      roomDeleted {
          id
      }
  }
`;

const ROOM_USER_JOINED_SUBSCRIPTION = gql`
  subscription {
      roomUserJoined {
          room {
              id
              title
          }
          user {
              id
              username
          }
      }
  }
`;

const ROOM_USER_LEFT_SUBSCRIPTION = gql`
  subscription {
      roomUserLeft {
          roomId
          userId
      }
  }
`;

// Simplified query - only request fields that server provides
const GET_PAGINATED_ROOMS_QUERY = gql`
  query {
      rooms {
          edges {
              id
              title
          }
      }
  }
`;

const Rooms = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(hasToken());

  // Update authentication state when token changes
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(hasToken());
    };

    // Check immediately
    checkAuth();

    // Listen for storage events (token changes)
    window.addEventListener('storage', checkAuth);
    
    // Also check periodically since storage events don't fire in same tab
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  const { data, loading, error, subscribeToMore, refetch } = useQuery(GET_PAGINATED_ROOMS_QUERY, {
    fetchPolicy: 'cache-and-network',
    pollInterval: isAuthenticated ? 5000 : 0, // Only poll when authenticated
    skip: !isAuthenticated // Skip query if not authenticated
  });

  if (loading || !data) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  const { rooms } = data || {};

  if (!rooms || !rooms.edges || rooms.edges.length === 0) {
    return (
      <RoomsContainer>
        <h1>Chat Rooms</h1>
        <p>No rooms available yet. Create the first one!</p>
        <RoomCreate />
      </RoomsContainer>
    );
  }

  const { edges } = rooms;

  return (
    <RoomsContainer>
      <h1>Chat Rooms</h1>
      <RoomList
        rooms={edges}
        subscribeToMore={subscribeToMore}
      />
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
        cursor: pageInfo?.endCursor || null,
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
              ...(previousResult.rooms.edges || []),
              ...(fetchMoreResult.rooms.edges || [])
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
    // Subscribe to room created events
    const unsubscribeCreated = subscribeToMore({
      document: ROOM_CREATED_SUBSCRIPTION,
      updateQuery: (previousResult, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return previousResult;
        }

        const { roomCreated } = subscriptionData.data;
        const newRoom = roomCreated.room;
        
        // Check if room already exists to prevent duplicates
        const existingEdges = previousResult.rooms.edges || [];
        const roomExists = existingEdges.some(room => room.id === newRoom.id);
        
        if (roomExists) {
          return previousResult;
        }

        return {
          ...previousResult,
          rooms: {
            ...previousResult.rooms,
            edges: [newRoom, ...existingEdges],
          },
        };
      },
    });

    // Subscribe to room deleted events
    const unsubscribeDeleted = subscribeToMore({
      document: ROOM_DELETED_SUBSCRIPTION,
      updateQuery: (previousResult, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return previousResult;
        }

        const { roomDeleted } = subscriptionData.data;
        const deletedRoomId = roomDeleted.id;
        
        return {
          ...previousResult,
          rooms: {
            ...previousResult.rooms,
            edges: previousResult.rooms.edges.filter(room => room.id !== deletedRoomId),
          },
        };
      },
    });

    return () => {
      if (unsubscribeCreated) unsubscribeCreated();
      if (unsubscribeDeleted) unsubscribeDeleted();
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
  background: ${props => props.theme.black};
  color: ${props => props.theme.green};
  border: 5px solid ${props => props.theme.green};
  border-radius: 5px;
  min-height: calc(100vh - 40px);
  margin: 20px;
  padding: 2rem;
  
  h1 {
    color: ${props => props.theme.green};
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 2rem;
    font-family: RussellSquareStd, monospace;
  }
  
  p {
    color: ${props => props.theme.green};
    text-align: center;
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 768px) {
    margin: 15px;
    border-width: 3px;
    min-height: calc(100vh - 30px);
    padding: 1.5rem;
    
    h1 {
      font-size: 2rem;
    }
  }
  
  @media (max-width: 425px) {
    margin: 10px;
    border-width: 2px;
    border-radius: 3px;
    min-height: calc(100vh - 20px);
    padding: 1rem;
    
    h1 {
      font-size: 1.5rem;
    }
  }
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
    padding: 10px;
    background: ${props => props.theme.black};
    border: 2px solid ${props => props.theme.green};
    border-radius: 5px;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 10px;
      align-items: stretch;
    }
  }
`;

const StyledRoomLink = styled(Link)`
  color: ${props => props.theme.green};
  background-color: ${props => props.theme.black};
  border: 3px solid ${props => props.theme.green};
  border-radius: 5px;
  padding: 12px 20px;
  font-weight: bold;
  font-size: 1.2em;
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;
  display: inline-block;
  white-space: nowrap;
  font-family: RussellSquareStd, monospace;
  transition: all 0.2s ease;
  flex: 1;
  
  &:hover {
    background-color: ${props => props.theme.green};
    color: ${props => props.theme.black};
    text-decoration: none;
  }
  
  @media (max-width: 768px) {
    font-size: 1em;
    padding: 10px 15px;
  }
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


