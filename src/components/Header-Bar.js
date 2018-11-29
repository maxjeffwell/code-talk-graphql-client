import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class HeaderBar extends Component {
  render() {
    return (
      <div className="header-bar">
        <div>
          <Link to="/Landing">
          </Link>
        </div>
      </div>
    )
  }
}
