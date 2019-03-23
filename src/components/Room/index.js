import React from 'react';
import { withRouter } from 'react-router-dom';

import GridSystem from './RoomGrid';

const Room = ({ match }) => {

  const roomId = match.params.id;

  return <GridSystem roomId={roomId} />
};

export default withRouter(Room);












