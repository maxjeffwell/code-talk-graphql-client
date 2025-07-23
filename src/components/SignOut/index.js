import React from 'react';
import { useApolloClient } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import * as routes from '../../constants/routes';
import styled from 'styled-components';
import { removeToken } from '../../utils/auth';
import { navigateToSignIn } from '../../utils/navigation';

const StyledButton = styled.button`
  position: relative;
  display: block;
  margin: 0 auto;
  text-align: center;
  background: ${props => props.theme.black}; 
  cursor: pointer;
  color: ${props => props.theme.green};
  text-transform: uppercase;
  text-decoration: none;
  font-size: 1.25rem;
  font-family: RussellSquareStd, monospace;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: 3px solid ${props => props.theme.green};
 &:hover {
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px      50px 0 rgba(0,0,0,0.19);
 }
`;

export const signOut = async (client, navigate = null) => {
  try {
    // Securely remove token from all storage locations
    removeToken();
    
    // Clear Apollo cache
    if (client && client.clearStore) {
      await client.clearStore();
    }
    
    // Force a complete page reload to ensure clean state
    // This is the most reliable way to clear all React state and subscriptions
    window.location.href = routes.SIGN_IN;
    
  } catch (error) {
    console.error('Error during sign out:', error);
    // Still navigate even if there's an error
    window.location.href = routes.SIGN_IN;
  }
};

const SignOutButton = () => {
  const client = useApolloClient();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut(client, navigate);
  };
  
  return (
    <div>
      <StyledButton 
        type="button" 
        onClick={handleSignOut}
        theme={{
          black: '#393939',
          green: '#30d403',
          white: '#EDEDED'
        }}
      >
        Sign Out
      </StyledButton>
    </div>
  );
};

export default SignOutButton;
