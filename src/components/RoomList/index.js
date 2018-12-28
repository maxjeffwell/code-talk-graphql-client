import React, { Component} from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';

class RoomList extends Component {
  renderRooms() {
    return this.props.data.rooms.map(room => {
      return (
        <li key={room.id} className={"collection-item"}>
          <Link to={`/rooms/${room.id}`}>
            {room.name}
          </Link>
        </li>
      );
    });
  }

  render() {
    if (this.props.data.loading) {
      return <div>Loading...</div>;
    }
    return (
      <ul className="collection">
        {this.renderRooms()}
      </ul>
    );
  }
}

export default graphql(RoomList);
