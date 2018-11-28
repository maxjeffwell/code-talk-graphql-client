import React, { Component } from 'react'
import { Mutation } from 'react-apollo';
import { LOGOUT_USER } from '../Mutations';

export class Logout extends Component {
  render(key) {
    return (
    <Mutation mutation={LOGOUT_USER} onClick={() => {
      localStorage.removeItem('AUTH_TOKEN');
      this.props.history.push('/');
    }} >
      {parsedLink => <button onClick={parsedLink}>Log Out</button>}
  </Mutation>
    );
  }
}

