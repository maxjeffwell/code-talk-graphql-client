import React from 'react';
import styled from 'styled-components';
import Typing from 'react-typing-animation';

import Footer from '../Footer';

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

const StyledTyping = styled(Typing)`
  margin: 20px 20px;
  font-weight: bold;
`;

const Landing = () => (
  <StyledLanding>
    <StyledTyping speed={15}>
      <span>Welcome to Code Talk. </span>
      <Typing.Delay ms={750} />
      <span>Code Talk is all about real-time code collaboration with concurrent real-time messaging capability. </span>
      <Typing.Delay ms={750} />
      <span>This is the place where you can write about writing code. </span>
      <Typing.Delay ms={750} />
      <p>
        <span>So meta? </span>
      <Typing.Delay ms={1200} />
      <span>Maybe. </span>
      </p>
      <Typing.Delay ms={1000} />
      <p>
        <span>Too meta? </span>
      <Typing.Delay ms={1200} />
        <span>Never. </span>
      </p>
      <Typing.Delay ms={1000} />
      <p>
        <span>Click the sign in button above </span>
        <Typing.Delay ms={300} />
        <span>(if you aren't already signed in) </span>
          <Typing.Delay ms={300} />
          <span>to sign in as either an existing user or to find the link to register as a new one.  </span>
        <Typing.Delay ms={750} />
        <span>Once signed in, </span>
      <Typing.Delay ms={650} />
      <span>navigate over to Code Talk Chat Rooms and join CODE TALK ONE - WHERE IT ALL BEGAN. </span>
      <Typing.Delay ms={750} />
        <span>There, </span>
        <Typing.Delay ms={650} />
        <span>you can communicate with other users in real-time by using the chat app on the left sidebar. </span>
      <Typing.Delay ms={750} />
        <span>At the same time, </span>
        <Typing.Delay ms={650} />
        <span>you'll see a textarea on the right where you and other users can collaborate on code that will immediately be made visible to everyone in the room. </span>
      </p>
      <Typing.Delay ms={1000} />
      <p>
        <span>Account info for two demo accounts can be found on both the login and registration pages. </span>
      </p>
    </StyledTyping>
    <Footer />
  </StyledLanding>
);

export default Landing;
