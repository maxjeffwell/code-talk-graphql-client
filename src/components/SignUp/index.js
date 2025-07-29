import React, { useState } from 'react';
import { NavLink as Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import styled from 'styled-components';

import * as routes from '../../constants/routes';
import ErrorMessage from '../Error';
import DemoAccounts from '../Demo';
import { setToken, getToken } from '../../utils/auth';
import { useNotifications } from '../Notifications/NotificationSystem';
import LoadingSpinner from '../Loading/LoadingSpinner';

import { StyledInput } from '../SignIn';
import { StyledButton } from '../SignIn';
import { breakpoint } from '../Variables';

const StyledHeader = styled.h1`
  color: ${props => props.theme.green};
  font-size: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: ${breakpoint.tablet}) {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: ${breakpoint.mobileL}) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
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
  background: ${props => props.theme.black};
  color: ${props => props.theme.green};
  border: 5px solid ${props => props.theme.green};
  border-radius: 5px;
  min-height: calc(100vh - 40px);
  margin: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  text-align: center;
  padding: 2rem;
  
  @media (max-width: ${breakpoint.tablet}) {
    margin: 15px;
    border-width: 3px;
    min-height: calc(100vh - 30px);
    padding: 1.5rem;
  }
  
  @media (max-width: ${breakpoint.mobileL}) {
    margin: 10px;
    border-width: 2px;
    border-radius: 3px;
    min-height: calc(100vh - 20px);
    padding: 1rem;
  }
`;

const StyledRegistrationDiv = styled.div`
  margin: auto;
  text-align: center;
`;

const StyledForm = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 2rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    margin-top: 1rem;
    font-weight: bold;
    color: ${props => props.theme.green};
  }
  
  h1 {
    margin: 2rem 0 1rem 0;
    text-align: center;
  }
  
  @media (max-width: ${breakpoint.tablet}) {
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: ${breakpoint.mobileL}) {
    margin-bottom: 1rem;
  }
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
  const { success, error: showError } = useNotifications();

  const [signUp, { data, loading, error }] = useMutation(SIGN_UP, {
    variables: { 
      username: formState.username, 
      email: formState.email, 
      password: formState.password 
    },
    onCompleted: (data) => {
      if (data?.signUp?.token) {
        console.log('Sign up mutation completed successfully');
        // Don't reload page - let the normal flow handle navigation
      }
    },
    onError: (error) => {
      console.error('Sign up error:', error);
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

      // Validate token before storing
      if (!data?.signUp?.token) {
        showError('Registration failed: No valid token received from server.', {
          title: 'Registration Failed',
          duration: 8000
        });
        return;
      }

      // Use secure token storage
      console.log('Registration successful, storing token:', data.signUp.token ? 'Token received' : 'No token received');
      setToken(data.signUp.token);
      console.log('Token stored, checking storage:', !!getToken());

      await refetch();

      success('Registration successful! Welcome to Code Talk.', {
        duration: 3000
      });

      navigate(routes.CHAT);
    } catch (error) {
      showError('Registration failed. Please check your information and try again.', {
        title: 'Registration Failed',
        duration: 8000
      });
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
    <StyledForm aria-label="Sign Up" onSubmit={onSubmit}>
      <label htmlFor="username-input">Username</label>
      <StyledInput
        id="username-input"
        name="username"
        value={username}
        onChange={onChange}
        type="text"
        placeholder="Username"
      />

      <label htmlFor="email-input">Email Address</label>
      <StyledInput
        id="email-input"
        name="email"
        value={email}
        onChange={onChange}
        type="email"
        placeholder="Email Address"
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

      <label htmlFor="password-confirmation-input">Confirm Password</label>
      <StyledInput
        id="password-confirmation-input"
        name="passwordConfirmation"
        value={passwordConfirmation}
        onChange={onChange}
        type="password"
        placeholder="Confirm Password"
      />

      <h1>
        <StyledButton 
          disabled={isInvalid || loading} 
          type="submit"
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </StyledButton>
      </h1>

      {loading && (
        <LoadingSpinner 
          text="Creating your account..." 
          size="24px" 
          padding="10px"
        />
      )}

      {error && <ErrorMessage error={error}/>}
    </StyledForm>
  );
};

const SignUpLink = () => (
  <StyledRegistrationDiv role="navigation">
    <p>
      Haven't signed up yet?
    </p>
    <h2>
      <StyledNavLink 
        className="register-link" 
        to={routes.SIGN_UP}
      >
        Register Here
      </StyledNavLink>
    </h2>
  </StyledRegistrationDiv>
);

export default SignUpPage;

export { SignUpForm, SignUpLink };

