import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const progressMove = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(333%); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.padding || '20px'};
  min-height: ${props => props.minHeight || 'auto'};
`;

const SpinnerRing = styled.div`
  display: inline-block;
  position: relative;
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  
  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-top-color: ${props => props.color || '#30d403'};
    border-radius: 50%;
    animation: ${spin} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }
  
  div:nth-child(1) { animation-delay: -0.45s; }
  div:nth-child(2) { animation-delay: -0.3s; }
  div:nth-child(3) { animation-delay: -0.15s; }
`;

const LoadingText = styled.div`
  margin-top: 15px;
  font-size: 14px;
  color: #6c757d;
  animation: ${pulse} 1.5s ease-in-out infinite;
  text-align: center;
`;

const ProgressBar = styled.div`
  width: 100%;
  max-width: 300px;
  height: 4px;
  background-color: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 10px;
  
  &::after {
    content: '';
    display: block;
    width: 30%;
    height: 100%;
    background-color: ${props => props.color || '#30d403'};
    border-radius: 2px;
    animation: ${progressMove} 1.5s ease-in-out infinite;
  }
`;

const LoadingSpinner = ({ 
  text = 'Loading...', 
  size = '40px', 
  color = '#30d403',
  showProgress = false,
  minHeight = 'auto',
  padding = '20px'
}) => {
  return (
    <LoadingContainer minHeight={minHeight} padding={padding}>
      <SpinnerRing size={size} color={color}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </SpinnerRing>
      {text && <LoadingText>{text}</LoadingText>}
      {showProgress && <ProgressBar color={color} />}
    </LoadingContainer>
  );
};

export default LoadingSpinner;