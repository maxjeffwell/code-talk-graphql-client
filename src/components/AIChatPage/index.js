import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Helmet } from 'react-helmet-async';

import {
  PageContainer,
  ChatContainer,
  ChatHeader,
  TerminalPrompt,
  MessagesContainer,
  MessageBubble,
  MessageRole,
  InputContainer,
  StyledTextarea,
  SendButton,
  LoadingDots,
  EmptyState,
  ErrorMessage,
} from './AIChatPage.styles';

const SEND_AI_MESSAGE = gql`
  mutation SendAIMessage($content: String!, $conversationHistory: [ChatMessageInput!]) {
    sendAIMessage(content: $content, conversationHistory: $conversationHistory) {
      id
      content
      role
      timestamp
      backend
      model
    }
  }
`;

const AIChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [sendAIMessage, { loading: isLoading }] = useMutation(SEND_AI_MESSAGE, {
    onError: (err) => {
      console.error('AI Chat error:', err);
      setError(err.message || 'Failed to get AI response. Please try again.');
    },
  });

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    // Add user message to chat
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmedInput,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError(null);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const { data } = await sendAIMessage({
        variables: {
          content: trimmedInput,
          conversationHistory,
        },
      });

      if (data?.sendAIMessage) {
        setMessages(prev => [...prev, data.sendAIMessage]);
      }
    } catch (err) {
      // Error is handled by onError callback
    } finally {
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <PageContainer>
      <Helmet>
        <title>AI Chat - Code Talk</title>
        <meta name="description" content="Chat with AI assistant in Code Talk" />
      </Helmet>

      <ChatContainer>
        <ChatHeader>
          <h1>
            <TerminalPrompt>$</TerminalPrompt> AI Assistant
          </h1>
        </ChatHeader>

        <MessagesContainer>
          {messages.length === 0 ? (
            <EmptyState>
              <p>Welcome to AI Chat</p>
              <p>Ask me anything about coding, debugging, or tech topics.</p>
              <p>Type your message below to get started.</p>
            </EmptyState>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} $isUser={message.role === 'user'}>
                <MessageRole $isUser={message.role === 'user'}>
                  {message.role === 'user' ? '> you' : '> ai'}
                  {message.backend && ` (${message.backend})`}
                </MessageRole>
                {message.content}
              </MessageBubble>
            ))
          )}

          {isLoading && (
            <MessageBubble $isUser={false}>
              <MessageRole $isUser={false}>> ai thinking</MessageRole>
              <LoadingDots>
                <span />
                <span />
                <span />
              </LoadingDots>
            </MessageBubble>
          )}

          <div ref={messagesEndRef} />
        </MessagesContainer>

        <InputContainer onSubmit={handleSubmit}>
          <StyledTextarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
            disabled={isLoading}
            minRows={1}
            maxRows={5}
          />
          <SendButton type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? 'Sending...' : 'Send'}
          </SendButton>
        </InputContainer>

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ChatContainer>
    </PageContainer>
  );
};

export default AIChatPage;
