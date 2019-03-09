import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';

import RoomGrid from './RoomGrid';

const Room = ({ match }) => {

  const { id } = match.params;
  console.log(id);

  return (
    <Fragment>
      <RoomGrid />
    </Fragment>
  );
}

export default withRouter(Room);












