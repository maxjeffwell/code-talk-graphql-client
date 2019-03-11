import React from 'react';
import { withRouter } from 'react-router-dom';

import RoomGrid from './RoomGrid';

const Room = ({ match }) => {

  const { id } = match.params;
  console.log(id);

  return <RoomGrid />
};

export default withRouter(Room);












