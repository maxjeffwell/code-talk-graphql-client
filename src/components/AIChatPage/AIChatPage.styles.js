import styled, { keyframes } from 'styled-components';
import TextareaAutosize from 'react-textarea-autosize';

const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

export const PageContainer = styled.div`
  min-height: calc(100vh - 200px);
  padding: 1rem;
  background: ${props => props.theme.black};
`;

export const ChatContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  border: 2px solid ${props => props.theme.green};
  border-radius: 8px;
  background: ${props => props.theme.black};
  display: flex;
  flex-direction: column;
  height: calc(100vh - 250px);
  min-height: 500px;
`;

export const ChatHeader = styled.div`
  padding: 1rem;
  border-bottom: 2px solid ${props => props.theme.green};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  h1 {
    margin: 0;
    font-size: 1.5rem;
    color: ${props => props.theme.green};
    font-family: RussellSquareStd, monospace;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

export const TerminalPrompt = styled.span`
  color: ${props => props.theme.green};

  &::after {
    content: '_';
    animation: ${blink} 1s infinite;
  }
`;

export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  /* Custom scrollbar for terminal feel */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.black};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.green};
    border-radius: 4px;
  }
`;

export const MessageBubble = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  max-width: 85%;
  font-family: RussellSquareStd, monospace;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;

  ${props => props.$isUser ? `
    align-self: flex-end;
    background: ${props.theme.green};
    color: ${props.theme.black};
    border: 2px solid ${props.theme.green};
  ` : `
    align-self: flex-start;
    background: ${props.theme.black};
    color: ${props.theme.green};
    border: 2px solid ${props.theme.green};
  `}
`;

export const MessageRole = styled.div`
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  opacity: 0.8;
  font-weight: bold;

  ${props => props.$isUser ? `
    color: ${props.theme.black};
  ` : `
    color: ${props.theme.green};
  `}
`;

export const InputContainer = styled.form`
  padding: 1rem;
  border-top: 2px solid ${props => props.theme.green};
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
`;

export const StyledTextarea = styled(TextareaAutosize)`
  flex: 1;
  font-size: 1rem;
  font-family: RussellSquareStd, monospace;
  border: 2px solid ${props => props.theme.green};
  background: ${props => props.theme.black};
  color: ${props => props.theme.green};
  resize: none;
  padding: 0.75rem;
  border-radius: 5px;

  &::placeholder {
    color: ${props => props.theme.green};
    opacity: 0.5;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(48, 212, 3, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SendButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-family: RussellSquareStd, monospace;
  font-size: 1rem;
  background: ${props => props.theme.green};
  color: ${props => props.theme.black};
  border: 2px solid ${props => props.theme.green};
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.theme.black};
    color: ${props => props.theme.green};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const LoadingDots = styled.span`
  display: inline-flex;
  gap: 4px;

  span {
    width: 8px;
    height: 8px;
    background: ${props => props.theme.green};
    border-radius: 50%;
    animation: ${keyframes`
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    `} 1.4s infinite ease-in-out;

    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
    &:nth-child(3) { animation-delay: 0s; }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  color: ${props => props.theme.green};
  opacity: 0.6;
  font-family: RussellSquareStd, monospace;
  padding: 2rem;

  p {
    margin: 0.5rem 0;
  }
`;

export const ErrorMessage = styled.div`
  color: #ff6b6b;
  padding: 0.5rem 1rem;
  border: 1px solid #ff6b6b;
  border-radius: 4px;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  font-family: RussellSquareStd, monospace;
`;
