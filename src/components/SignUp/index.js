import React, { Component } from 'react';
import { NavLink as Link, withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import * as routes from '../../constants/routes';
import ErrorMessage from '../Error';

import styled from 'styled-components';

const SIGN_UP = gql`
    mutation($username: String!, $email: String!, $password: String!) {
        signUp(username: $username, email: $email, password: $password) {
            token
        }
    }
`;

const INITIAL_STATE = {
  username: '',
  email: '',
  password: '',
  passwordConfirmation: ''
};

const SignUpPage = ({ history, refetch }) => (
  <div>
    <h2>Sign Up</h2>
    <SignUpForm history={history} refetch={refetch} />
  </div>
);

class SignUpForm extends Component {
  state = { ...INITIAL_STATE };

  onChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onSubmit = (event, signUp) => {
    signUp().then(async ({ data }) => {
      this.setState({ ...INITIAL_STATE });

      localStorage.setItem('token', data.signUp.token);

      await this.props.refetch();

      this.props.history.push(routes.LANDING);
    });

    event.preventDefault();
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
    } = this.state;

    const isInvalid =
      password !== passwordConfirmation ||
      password === '' ||
      email === '' ||
      username === '';

    return (
      <Mutation
        mutation={SIGN_UP}
        variables={{ username, email, password }}
      >
        {(signUp, { data, loading, error }) => (
          <form onSubmit={event => this.onSubmit(event, signUp)}>
            <input
              name="username"
              value={username}
              onChange={this.onChange}
              type="text"
              placeholder="Full Name"
            />
            <input
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              placeholder="Email Address"
            />
            <input
              name="password"
              value={password}
              onChange={this.onChange}
              type="password"
              placeholder="Password"
            />
            <input
              name="passwordConfirmation"
              value={passwordConfirmation}
              onChange={this.onChange}
              type="password"
              placeholder="Confirm Password"
            />
            <button disabled={isInvalid || loading} type="submit">
              Sign Up
            </button>

            {error && <ErrorMessage error={error}/>}
          </form>
        )}
      </Mutation>
    );
  }
}

const NavLink = styled(Link)`
  font-size: 1.5rem;
  margin-left: .5rem;
  padding: 0.5rem;
  background: ${props => props.theme.black};
  color: ${props => props.theme.green};
  text-transform: uppercase;
  text-decoration: none;
`;

const SignUpLink = () => (
  <div className="register-link">
    <p>
      Haven't signed up yet?
    </p>
    <NavLink to={routes.SIGN_UP}>Register Here</NavLink>
  </div>
);

export default withRouter(SignUpPage);

export { SignUpForm, SignUpLink };

