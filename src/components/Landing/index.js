import React from 'react';

import withSession from '../Session/withSession';

import { MessageCreate, Messages } from '../Message';

import styled from 'styled-components';

const StyledLanding = styled.div`
  background: ${props => props.theme.white};
  color: ${props => props.theme.black};
`;

const Landing = ({ session }) => (
  <StyledLanding>
    <h2>Landing Page</h2>
    {session && session.me && <MessageCreate />}
    <Messages me={session.me} limit={20} />
  </StyledLanding>
);

export default withSession(Landing);
