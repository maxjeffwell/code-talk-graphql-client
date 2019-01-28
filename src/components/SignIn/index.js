import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { SignUpLink } from '../SignUp';
import * as routes from '../../constants/routes';
import ErrorMessage from '../Error';

import styled from 'styled-components';

export const StyledButton = styled.button`
  cursor: pointer;
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
  display: inline-block;
  text-align: center;
  width: 100%;
  margin-top: 20px;
`;

export const StyledInput = styled.input`
  display: block;
  margin: 5px auto;
  font-family: RussellSquareStd, monospace;
  font-weight: normal;
  font-style: normal;
  border: 2px solid ${props => props.theme.black};
  border-radius: 3px;
  outline: none;
  background-color: ${props => props.theme.white} ;
  &::-webkit-input-placeholder {
    font-family: RussellSquareStd, monospace;
  } 
`;

const SIGN_IN = gql`
    mutation($login: String!, $password: String!) {
        signIn(login: $login, password: $password) {
            token
        }
    }
`;

const SignInPage = ({ history, refetch }) => (
  <Fragment>
  <SignInForm history={history} refetch={refetch} />
    <SignUpLink />
  </Fragment>
);

const INITIAL_STATE = {
  login: '',
  password: '',
};

class SignInForm extends Component {
  state = { ...INITIAL_STATE };

  onChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onSubmit = (event, signIn) => {
    signIn().then(async ({ data }) => {
      this.setState({ ...INITIAL_STATE });

      localStorage.setItem('token', data.signIn.token);

      await this.props.refetch();

      this.props.history.push(routes.LANDING);
    });

    event.preventDefault();
  };

  render() {
    const { login, password } = this.state;

    const isInvalid = password === '' || login === '';

    return (
      <Mutation mutation={SIGN_IN} variables={{ login, password }}>
        {(signIn, { data, loading, error }) => (

          <StyledDiv className="loginForm" aria-live="polite">
          <form aria-label="Sign In" onSubmit={event => this.onSubmit(event, signIn)}>

            <label htmlFor="Username" aria-label="Username">
            <StyledInput
              name="login"
              value={login}
              onChange={this.onChange}
              type="text"
              placeholder="Email or Username"
            /></label>

            <label htmlFor="Password" aria-label="Password">
            <StyledInput
              name="password"
              value={password}
              onChange={this.onChange}
              type="password"
              placeholder="Password"
            /> </label>

            <h1>
              <StyledButton disabled={isInvalid || loading} type="submit" className="btn-login">
              Sign In
            </StyledButton>
            </h1>

            {error && <ErrorMessage error={error} />}
          </form>
          </StyledDiv>
        )}
      </Mutation>
    );
  }
}

export default withRouter(SignInPage);

export { SignInForm };
