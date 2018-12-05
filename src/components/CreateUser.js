import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from "graphql-tag";

class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      usernameError: '',
      email: '',
      emailError: '',
      password: '',
      passwordError: ''
    }
  }

  onClick = async () => {
    this.setState({
      usernameError: '',
      emailError: '',
      passwordError: ''
    });

    const {username, email, password} = this.state;

    const response = await this.props.mutate({
      variables: {username, email, password}
    });

    const {ok, errors} = response.data.signup;

    if (ok) {
      this.props.history.push('/login');
    } else {
      const err = {};
      errors.forEach(({path, message}) => {
        err[`${path}Error`] = message;
      });

      this.setState(err);
    }
  }

  render() {
    const {username, email, password, usernameError, emailError, passwordError} = this.state;
    const errorList = [];

    if (usernameError) {
      errorList.push(usernameError);
    }

    if (emailError) {
      errorList.push(emailError);
    }

    if (passwordError) {
      errorList.push(passwordError);
    }

    return (
      <section>
        <input error={!!usernameError} type="text" placeholder="Username" value={username}
               onChange={e => this.setState({username: e.target.value})}/>
        <input error={!!emailError} type="text" placeholder="Email" value={email}
               onChange={e => this.setState({email: e.target.value})}/>
        <input error={!!passwordError} type="password" placeholder="Password" value={password}
               onChange={e => this.setState({password: e.target.value})}/>


        <button onClick={this.onClick}>Register</button>
        {errorList.length ? (
          {errorList}
        ) : null}
      </section>
    );
  }
}

const CREATE_USER = gql`
    mutation CreateUserMutation($username: String!, $email: String!, $password: String!){
        signup(username: $username, email: $email, password: $password) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

  export default graphql(CREATE_USER)(CreateUser);
