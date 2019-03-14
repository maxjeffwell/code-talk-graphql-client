import React from 'react';
import { withRouter } from 'react-router-dom';

import RoomGrid from './RoomGrid';

const Room = ({ match }) => {

  const roomId = match.params.id;

  return <RoomGrid roomId={roomId} />
};

export default withRouter(Room);












