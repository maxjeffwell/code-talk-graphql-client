import React, { Component } from 'react';
import { NavLink as Link, withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import * as routes from '../../constants/routes';
import ErrorMessage from '../Error';

import styled from 'styled-components';

const StyledNavLink = styled(Link)`
  font-size: 1.5rem;
  padding: 0.5rem;
  background: ${props => props.theme.black};
  color: ${props => props.theme.green};
  text-transform: uppercase;
  text-decoration: none;
`;

const StyledRegistrationDiv = styled.div`
  margin: auto;
  text-align: center;
`
const StyledButton = styled.button`
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 3px;
  background: ${props => props.theme.black};
  color: ${props => props.theme.green};
  text-transform: uppercase;
  text-decoration: none;
`;

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
  <div role="form">
    <h1>Sign Up</h1>
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
          <form aria-label="Sign Up" onSubmit={event => this.onSubmit(event, signUp)}>
            <label htmlFor="username">Username
            <input
              name="username"
              value={username}
              onChange={this.onChange}
              type="text"
              placeholder="Full Name"
            />
            </label>
            <label htmlFor="Email">Email
            <input
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              placeholder="Email Address"
            />
            </label>
            <label htmlFor="Password">Password
            <input
              name="password"
              value={password}
              onChange={this.onChange}
              type="password"
              placeholder="Password"
            />
            </label>
            <label htmlFor="Confirm Password">
              Confirm Password
            <input
              name="passwordConfirmation"
              value={passwordConfirmation}
              onChange={this.onChange}
              type="password"
              placeholder="Confirm Password"
            />
            </label>
            <StyledButton disabled={isInvalid || loading} type="submit">
              Sign Up
            </StyledButton>

            {error && <ErrorMessage error={error}/>}
          </form>
        )}
      </Mutation>
    );
  }
}

const SignUpLink = () => (
  <StyledRegistrationDiv role="navigation">
    <p>
      Haven't signed up yet?
    </p>
    <StyledNavLink className="register-link" to={routes.SIGN_UP}>Register Here</StyledNavLink>
  </StyledRegistrationDiv>
);

export default withRouter(SignUpPage);

export { SignUpForm, SignUpLink };

