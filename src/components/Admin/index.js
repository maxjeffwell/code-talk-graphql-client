import React from 'react';

import withAuthorization from '../Session/withAuthorization';
import RoomList from '../Room/RoomList';

const AdminPage = () => (
  <div>
    <h1>Admin Page</h1>
    <RoomList />
  </div>
);

export default withAuthorization(
  session => session && session.me && session.me.role === 'ADMIN',
)(AdminPage);
