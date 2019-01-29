import React, { Component } from 'react';
import { NavLink as Link, withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';

import * as routes from '../../constants/routes';
import ErrorMessage from '../Error';
import DemoAccounts from '../Demo';

import { StyledInput } from '../SignIn';
import { StyledButton } from '../SignIn';

const StyledHeader = styled.h1`
  color: ${props => props.theme.green};
  background-color: ${props => props.theme.black};
  border: 5px solid ${props => props.theme.green};
  border-radius: 5px;
  font-size: 2rem;
  display: inline-block;
  padding: 5px 10px;
`;

const StyledNavLink = styled(Link)`
  padding: 0.5rem 1rem;
  background: ${props => props.theme.black};
  color: ${props => props.theme.green};
  text-transform: uppercase;
  text-decoration: none;
  border: 5px solid ${props => props.theme.green};
  border-radius: 5px;
  font-weight: bold;
`;

const StyledDiv = styled.div`
  text-align: center;
`;

const StyledRegistrationDiv = styled.div`
  margin: auto;
  text-align: center;
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
  <StyledDiv role="form">
    <StyledHeader>BECOME A CODE TALKER</StyledHeader>
    <SignUpForm history={history} refetch={refetch} />
    <div>
      <p>Prefer not to sign up right now? Feel free to use a demo instead</p>
    </div>
    <DemoAccounts />
  </StyledDiv>
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

      this.props.history.push(routes.ROOMS);
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
            <h1>
            <StyledButton disabled={isInvalid || loading} type="submit">
              Sign Up
            </StyledButton>
            </h1>

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
    <h2>
      <StyledNavLink className="register-link" to={routes.SIGN_UP}>Register Here</StyledNavLink>
    </h2>
  </StyledRegistrationDiv>
);

export default withRouter(SignUpPage);

export { SignUpForm, SignUpLink };

