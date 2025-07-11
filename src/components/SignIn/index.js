import React, { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

import { SignUpLink } from '../SignUp';
import * as routes from '../../constants/routes';
import DemoAccounts from '../Demo';
import { setToken } from '../../utils/auth';
import { useNotifications } from '../Notifications/NotificationSystem';
import LoadingSpinner from '../Loading/LoadingSpinner';

import styled from 'styled-components';

export const StyledButton = styled.button`
  cursor: pointer;
  padding: 5px 5px 5px 5px;
  background: ${props => props.theme.green};
  color: ${props => props.theme.black};
  font-family: RussellSquareStd, monospace;
  text-transform: uppercase;
  text-decoration: none;
  border: 2px solid ${props => props.theme.black};
  border-radius: 5px;
  font-weight: bold;
  font-size: .5em;
  &:hover:not([disabled]) {
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px     50px 0 rgba(0,0,0,0.19);
  }
  &:disabled {
    background: #dddddd;
    cursor: not-allowed;
  }
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
  font-size: 1.2em;
  border: 2px solid ${props => props.theme.black};
  border-radius: 3px;
  outline: none;
  padding: 5px 5px 2px 10px;
  background-color: ${props => props.theme.green} ;
  &::-webkit-input-placeholder {
    font-family: RussellSquareStd, monospace;
    font-weight: bold;
    color: ${props => props.theme.black};
  } 
`;

const StyledHeader = styled.h1`
  margin-top: 5px;
`;

const StyledForm = styled.form`
  margin-bottom: 5px;
`;

const SIGN_IN = gql`
    mutation($login: String!, $password: String!) {
        signIn(login: $login, password: $password) {
            token
        }
    }
`;

const SignInPage = ({ refetch }) => (
  <Fragment>
  <SignInForm refetch={refetch} />
    <SignUpLink />
  </Fragment>
);

const INITIAL_STATE = {
  login: '',
  password: '',
};

const SignInForm = ({ refetch }) => {
  const [formState, setFormState] = useState({ ...INITIAL_STATE });
  const navigate = useNavigate();
  const { success, error: showError } = useNotifications();

  const [signIn, { loading }] = useMutation(SIGN_IN, {
    variables: { 
      login: formState.login, 
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
      const { data } = await signIn();
      setFormState({ ...INITIAL_STATE });

      // Use secure token storage
      setToken(data.signIn.token);

      await refetch();

      success('Successfully signed in! Welcome back.', {
        duration: 3000
      });

      navigate(routes.ROOM);
    } catch (error) {
      showError('Failed to sign in. Please check your credentials and try again.', {
        title: 'Sign In Failed',
        duration: 8000
      });
    }
  };

  const { login, password } = formState;

  const isInvalid = password === '' || login === '';

  return (
    <StyledDiv className="loginForm" aria-live="polite">
    <StyledForm aria-label="Sign In" onSubmit={onSubmit}>

      <label htmlFor="Username" aria-label="Username">
      <StyledInput
        name="login"
        value={login}
        onChange={onChange}
        type="text"
        placeholder="Email or Username"
      /></label>

      <label htmlFor="Password" aria-label="Password">
      <StyledInput
        name="password"
        value={password}
        onChange={onChange}
        type="password"
        placeholder="Password"
      /> </label>

      <StyledHeader>
        <StyledButton disabled={isInvalid || loading} type="submit" className="btn-login">
        {loading ? 'Signing In...' : 'Sign In'}
      </StyledButton>
      </StyledHeader>

      {loading && (
        <LoadingSpinner 
          text="Signing you in..." 
          size="24px" 
          padding="10px"
        />
      )}
    </StyledForm>
      <DemoAccounts />
    </StyledDiv>
  );
};

export default SignInPage;

export { SignInForm };
