import React from 'react';
import styled from 'styled-components';

const StyledErrorMessage = styled.div`
  margin: 20px;
  display: flex;
  justify-content: center;
  color: red;
`;

const ErrorMessage = ({ error }) => (
  <StyledErrorMessage>
    <small>{error.message.replace('GraphQL error:', '').trim()}</small>
  </StyledErrorMessage>
);

export default ErrorMessage;
