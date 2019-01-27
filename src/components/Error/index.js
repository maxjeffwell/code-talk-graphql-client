import React from 'react';
import styled from 'styled-components';

const StyledErrorMessage = styled.div`
  margin: 20px;
  display: flex;
  justify-content: center;
`;

const ErrorMessage = ({ error }) => (
  <StyledErrorMessage>
    <small>{error.message}</small>
  </StyledErrorMessage>
);

export default ErrorMessage;
