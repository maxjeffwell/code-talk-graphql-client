import React from 'react';
import { useParams } from 'react-router-dom';

import GridSystem from './RoomGrid';

const Room = () => {
  const { id: roomId } = useParams();

  return <GridSystem roomId={roomId} />
};

export default Room;












