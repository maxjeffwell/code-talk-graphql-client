import React, { Component } from 'react';


export class Message extends Component {
  render() {
    return (
      <div className="Message">
        <div className="MessageHeader">
          <div className="Username">{this.props.username}</div>
        </div>
        <div className="Message">{this.props.message}</div>
      </div>
    );
  }
}
