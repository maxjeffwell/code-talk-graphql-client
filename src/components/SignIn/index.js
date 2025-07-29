import React, { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

import { SignUpLink } from '../SignUp';
import * as routes from '../../constants/routes';
import DemoAccounts from '../Demo';
import { setToken, getToken } from '../../utils/auth';
import { useNotifications } from '../Notifications/NotificationSystem';
import LoadingSpinner from '../Loading/LoadingSpinner';
import { reconnectWebSocket } from '../../index';

import styled from 'styled-components';
import { breakpoint } from '../Variables';

export const StyledButton = styled.button`
  cursor: pointer;
  padding: 0.8rem 1.5rem;
  background: ${props => props.theme.green};
  color: ${props => props.theme.black};
  font-family: RussellSquareStd, monospace;
  text-transform: uppercase;
  text-decoration: none;
  border: 2px solid ${props => props.theme.black};
  border-radius: 5px;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover:not([disabled]) {
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: #dddddd;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: ${breakpoint.tablet}) {
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: ${breakpoint.mobileL}) {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }
`;

const StyledDiv = styled.div`
  display: block;
  text-align: center;
  width: 100%;
  max-width: 500px;
  margin: 40px auto 20px auto;
  padding: 2rem;
  background: ${props => props.theme.black};
  color: ${props => props.theme.green};
  border: 3px solid ${props => props.theme.green};
  border-radius: 10px;
  
  @media (max-width: ${breakpoint.tablet}) {
    margin: 30px auto 15px auto;
    padding: 1.5rem;
    max-width: 90%;
  }
  
  @media (max-width: ${breakpoint.mobileL}) {
    margin: 20px auto 10px auto;
    padding: 1rem;
    max-width: 95%;
  }
`;

export const StyledInput = styled.input`
  display: block;
  margin: 1rem auto;
  font-family: RussellSquareStd, monospace;
  font-weight: normal;
  font-style: normal;
  font-size: 1.1rem;
  border: 2px solid ${props => props.theme.green};
  border-radius: 5px;
  outline: none;
  padding: 0.8rem 1rem;
  background-color: ${props => props.theme.black};
  color: ${props => props.theme.green};
  width: 100%;
  max-width: 300px;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: ${props => props.theme.green};
    box-shadow: 0 0 0 2px rgba(48, 212, 3, 0.2);
  }
  
  &::placeholder {
    font-family: RussellSquareStd, monospace;
    font-weight: bold;
    color: ${props => props.theme.green};
    opacity: 0.7;
  }
  
  @media (max-width: ${breakpoint.tablet}) {
    font-size: 1rem;
    padding: 0.7rem 0.8rem;
  }
  
  @media (max-width: ${breakpoint.mobileL}) {
    font-size: 0.9rem;
    padding: 0.6rem 0.7rem;
    max-width: 100%;
  }
`;

const StyledHeader = styled.div`
  margin: 2rem 0 1rem 0;
  text-align: center;
  
  @media (max-width: ${breakpoint.tablet}) {
    margin: 1.5rem 0 0.8rem 0;
  }
  
  @media (max-width: ${breakpoint.mobileL}) {
    margin: 1.2rem 0 0.6rem 0;
  }
`;

const StyledForm = styled.form`
  margin-bottom: 2rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: ${props => props.theme.green};
  }
  
  @media (max-width: ${breakpoint.tablet}) {
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: ${breakpoint.mobileL}) {
    margin-bottom: 1rem;
  }
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
    },
    onCompleted: (data) => {
      if (data?.signIn?.token) {
        console.log('Sign in mutation completed successfully');
        // Don't reload page - let the normal flow handle navigation
      }
    },
    onError: (error) => {
      console.error('Sign in error:', error);
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
      console.log('Sign in successful, storing token:', data.signIn.token ? 'Token received' : 'No token received');
      setToken(data.signIn.token);
      console.log('Token stored, checking storage:', !!getToken());
      
      // Store token and wait a moment for it to be available
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify token is stored
      const storedToken = getToken();
      console.log('Token verification after storage:', !!storedToken);
      
      // Reconnect WebSocket with new authentication
      await reconnectWebSocket();

      // Wait for WebSocket to establish connection
      await new Promise(resolve => setTimeout(resolve, 500));

      await refetch();

      success('Successfully signed in! Welcome back.', {
        duration: 3000
      });

      // Force a full page reload to ensure all subscriptions restart with auth
      // This is a workaround for WebSocket authentication issues
      window.location.href = routes.CHAT;
    } catch (error) {
      console.error('Sign in error details:', error);
      
      // Check for specific error messages
      const errorMessage = error.graphQLErrors?.[0]?.message || error.message || '';
      
      let displayMessage = 'Failed to sign in. Please check your credentials and try again.';
      let title = 'Sign In Failed';
      
      if (errorMessage.toLowerCase().includes('password') || 
          errorMessage.toLowerCase().includes('credential') ||
          errorMessage.toLowerCase().includes('invalid')) {
        displayMessage = 'Incorrect password. Please check your password and try again.';
        title = 'Incorrect Password';
      } else if (errorMessage.toLowerCase().includes('user') && 
                 errorMessage.toLowerCase().includes('not found')) {
        displayMessage = 'User not found. Please check your email/username and try again.';
        title = 'User Not Found';
      }
      
      showError(displayMessage, {
        title: title,
        duration: 8000
      });
    }
  };

  const { login, password } = formState;

  const isInvalid = password === '' || login === '';

  return (
    <StyledDiv className="loginForm" aria-live="polite">
      <StyledForm aria-label="Sign In" onSubmit={onSubmit}>

        <label htmlFor="login-input">Email or Username</label>
        <StyledInput
          id="login-input"
          name="login"
          value={login}
          onChange={onChange}
          type="text"
          placeholder="Email or Username"
        />

        <label htmlFor="password-input">Password</label>
        <StyledInput
          id="password-input"
          name="password"
          value={password}
          onChange={onChange}
          type="password"
          placeholder="Password"
        />

        <StyledHeader>
          <StyledButton 
            disabled={isInvalid || loading} 
            type="submit" 
            className="btn-login"
          >
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
