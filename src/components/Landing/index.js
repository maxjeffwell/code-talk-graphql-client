import React from 'react';
import styled, { keyframes, css } from 'styled-components';

import Footer from '../Footer';

const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blinkCursor = keyframes`
  from, to { border-color: transparent; }
  50% { border-color: currentColor; }
`;

const StyledLanding = styled.div`
  background: ${props => props.theme.black};
  color: ${props => props.theme.green};
  border: 5px solid ${props => props.theme.green};
  border-radius: 5px;
  min-height: 100vh;
  margin: 20px 30px 10px;
  display: grid;
  grid-template-rows: 1fr auto;
  overflow: auto;
`;

const StyledContent = styled.div`
  margin: 20px 20px;
  font-weight: bold;
  
  h1 {
    overflow: hidden;
    border-right: 3px solid;
    white-space: nowrap;
    animation: ${css`${typewriter} 3s steps(40, end), ${blinkCursor} 0.75s step-end infinite`};
    font-size: 2em;
    margin-bottom: 2em;
  }
  
  p {
    margin: 1.5em 0;
    line-height: 1.6;
    opacity: 0;
    animation: fadeIn 1s ease-in-out 3s forwards;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
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
