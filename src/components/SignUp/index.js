import React, { useState } from 'react';
import { NavLink as Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import styled from 'styled-components';

import * as routes from '../../constants/routes';
import ErrorMessage from '../Error';
import DemoAccounts from '../Demo';
import { setToken } from '../../utils/auth';

import { StyledInput } from '../SignIn';
import { StyledButton } from '../SignIn';

const StyledHeader = styled.h1`
  color: ${props => props.theme.black};
  font-size: 2rem;
  display: inline-block;
  padding: 5px 10px;
`;

const StyledNavLink = styled(Link)`
  padding: 0.5rem 1rem;
  border: 5px solid ${props => props.theme.green};
  background: ${props => props.theme.black};
  color: ${props => props.theme.green};
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  &:hover {
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px     50px 0 rgba(0,0,0,0.19);
  }
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

const SignUpPage = ({ refetch }) => (
  <StyledDiv role="form">
    <StyledHeader>Code Talk Registration</StyledHeader>
    <SignUpForm refetch={refetch} />
    <div>
      <p>Prefer not to sign up right now? Feel free to use a demo instead</p>
    </div>
    <DemoAccounts />
  </StyledDiv>
);

const SignUpForm = ({ refetch }) => {
  const [formState, setFormState] = useState({ ...INITIAL_STATE });
  const navigate = useNavigate();

  const [signUp, { data, loading, error }] = useMutation(SIGN_UP, {
    variables: { 
      username: formState.username, 
      email: formState.email, 
      password: formState.password 
    }
  });

  const onChange = event => {
    const { name, value } = event.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const { data } = await signUp();
      setFormState({ ...INITIAL_STATE });

      // Use secure token storage
      setToken(data.signUp.token);

      await refetch();

      navigate(routes.ROOM);
    } catch (error) {
      // Error is handled by the error state from useMutation
    }
  };

  const {
    username,
    email,
    password,
    passwordConfirmation,
  } = formState;

  const isInvalid =
    password !== passwordConfirmation ||
    password === '' ||
    email === '' ||
    username === '';

  return (
    <form aria-label="Sign Up" onSubmit={onSubmit}>
      <label htmlFor="Username" aria-label="Username">
      <StyledInput
        name="username"
        value={username}
        onChange={onChange}
        type="text"
        placeholder="Username"
      />
      </label>
      <label htmlFor="Email" aria-label="Email">
      <StyledInput
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      </label>
      <label htmlFor="Password" aria-label="Password">
      <StyledInput
        name="password"
        value={password}
        onChange={onChange}
        type="password"
        placeholder="Password"
      />
      </label>
      <label htmlFor="Confirm Password" aria-label="Confirm Password">
      <StyledInput
        name="passwordConfirmation"
        value={passwordConfirmation}
        onChange={onChange}
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
  );
};

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

export default SignUpPage;

export { SignUpForm, SignUpLink };

