import React from 'react';
import { withRouter } from 'react-router-dom';

import RoomGrid from './RoomGrid';

const Room = ({ match }) => {

  let roomId = match.params.id;
  console.log(roomId);

  return <RoomGrid />
};

export default withRouter(Room);












