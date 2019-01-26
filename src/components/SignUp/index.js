import React, { Component } from 'react';
import { NavLink as Link, withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';

import * as routes from '../../constants/routes';
import ErrorMessage from '../Error';

import { StyledInput } from '../SignIn';

const StyledNavLink = styled(Link)`
  padding: 0.5rem 1rem;
  background: ${props => props.theme.black};
  color: ${props => props.theme.green};
  text-transform: uppercase;
  text-decoration: none;
  border: 5px solid ${props => props.theme.green};
  border-radius: 5px;
`;

const StyledRegistrationDiv = styled.div`
  margin: auto;
  text-align: center;
`;

const StyledButton = styled.button`
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 3px;
  background: ${props => props.theme.black};
  color: ${props => props.theme.green};
  text-transform: uppercase;
  text-decoration: none;
  border: 5px solid ${props => props.theme.green};
  border-radius: 5px;
  font-size: 1.2rem;
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
            <label htmlFor="Username" aria-label="Username">
            <StyledInput
              name="username"
              value={username}
              onChange={this.onChange}
              type="text"
              placeholder="Full Name"
            />
            </label>
            <label htmlFor="Email" aria-label="Email">
            <StyledInput
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              placeholder="Email Address"
            />
            </label>
            <label htmlFor="Password" aria-label="Password">
            <StyledInput
              name="password"
              value={password}
              onChange={this.onChange}
              type="password"
              placeholder="Password"
            />
            </label>
            <label htmlFor="Confirm Password" aria-label="Confirm Password">
            <StyledInput
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

