import React from 'react';
import styled, { keyframes } from 'styled-components';

import Footer from '../Footer';
import { breakpoint } from '../Variables';

const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blinkCursor = keyframes`
  from, to { border-color: transparent; }
  50% { border-color: currentColor; }
`;

const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const StyledLanding = styled.div`
  background: ${props => props.theme.black};
  color: ${props => props.theme.green};
  border: 5px solid ${props => props.theme.green};
  border-radius: 5px;
  min-height: calc(100vh - 40px);
  margin: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  @media (max-width: ${breakpoint.tablet}) {
    margin: 15px;
    border-width: 3px;
    min-height: calc(100vh - 30px);
  }
  
  @media (max-width: ${breakpoint.mobileL}) {
    margin: 10px;
    border-width: 2px;
    border-radius: 3px;
    min-height: calc(100vh - 20px);
  }
`;

const StyledContent = styled.div`
  flex: 1;
  padding: 20px;
  font-weight: bold;
  overflow-y: auto;
  
  @media (max-width: ${breakpoint.tablet}) {
    padding: 15px;
  }
  
  @media (max-width: ${breakpoint.mobileL}) {
    padding: 10px;
  }
  
  h1 {
    border-right: 3px solid;
    white-space: nowrap;
    animation-name: ${typewriter}, ${blinkCursor};
    animation-duration: 3s, 0.75s;
    animation-timing-function: steps(40, end), step-end;
    animation-iteration-count: 1, infinite;
    font-size: 2.5em;
    margin-bottom: 1.5em;
    width: fit-content;
    
    @media (max-width: ${breakpoint.tablet}) {
      font-size: 2em;
      margin-bottom: 1.2em;
    }
    
    @media (max-width: ${breakpoint.mobileL}) {
      font-size: 1.5em;
      margin-bottom: 1em;
      white-space: normal;
      border-right: none;
      animation: none;
    }
  }
  
  p {
    margin: 1.2em 0;
    line-height: 1.6;
    opacity: 0;
    animation: ${fadeIn} 1s ease-in-out 3s forwards;
    font-size: 1.1em;
    
    @media (max-width: ${breakpoint.tablet}) {
      margin: 1em 0;
      font-size: 1em;
    }
    
    @media (max-width: ${breakpoint.mobileL}) {
      margin: 0.8em 0;
      font-size: 0.9em;
      line-height: 1.5;
      animation: none;
      opacity: 1;
    }
  }
`;

const Landing = () => (
  <StyledLanding>
    <StyledContent>
      <h1>Welcome to Code Talk</h1>
      <p>
        Code Talk is all about real-time code collaboration with concurrent real-time messaging capability.
        This is the place where you can write about writing code.
      </p>
      <p>
        <strong>So meta?</strong> Maybe. <strong>Too meta?</strong> Never.
      </p>
      <p>
        Click the sign in button above (if you haven't already signed in) to sign in as either an existing user 
        or to find the link to register as a new one. Once signed in, you'll be taken to the Code Talk Chat Room.
      </p>
      <p>
        There, you can communicate with other users in real-time by using the chat app on the left sidebar. 
        At the same time, you'll see a textarea on the right where you and other users can collaborate on code 
        that will immediately be made visible to everyone in the room.
      </p>
      <p>
        Account info for two demo accounts can be found on both the login and registration pages.
      </p>
    </StyledContent>
    <Footer />
  </StyledLanding>
);

export default Landing;
