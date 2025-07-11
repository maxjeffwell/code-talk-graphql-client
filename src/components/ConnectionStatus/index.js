import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useApolloClient } from '@apollo/client';
import logger from '../../utils/logger';

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const StatusContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 8px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 999;
  font-size: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    top: 10px;
    left: 10px;
    right: 10px;
    width: auto;
    justify-content: center;
  }
`;

const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${props => {
    switch (props.status) {
      case 'connected': return '#28a745';
      case 'connecting': return '#ffc107';
      case 'disconnected': return '#dc3545';
      case 'error': return '#dc3545';
      default: return '#6c757d';
    }
  }};
  
  ${props => props.status === 'connecting' && css`
    animation: ${pulse} 1s infinite;
  `}
`;

const StatusText = styled.span`
  color: ${props => {
    switch (props.status) {
      case 'connected': return '#28a745';
      case 'connecting': return '#856404';
      case 'disconnected': return '#721c24';
      case 'error': return '#721c24';
      default: return '#6c757d';
    }
  }};
  font-weight: 500;
  margin-right: 8px;
`;

const LastUpdated = styled.span`
  color: #6c757d;
  font-size: 10px;
  margin-left: 8px;
`;

const RetryButton = styled.button`
  background: none;
  border: 1px solid currentColor;
  color: inherit;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  cursor: pointer;
  margin-left: 8px;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ConnectionStatus = () => {
  const [status, setStatus] = useState('connecting');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRetrying, setIsRetrying] = useState(false);
  const client = useApolloClient();

  useEffect(() => {
    // Don't set up effects if client is not available
    if (!client) {
      setStatus('error');
      return;
    }

    try {
      // Check network connectivity
      const updateOnlineStatus = () => {
        setStatus(navigator.onLine ? 'connected' : 'disconnected');
        setLastUpdated(new Date());
      };

      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);

      // Initial status check
      updateOnlineStatus();

      // Monitor Apollo Client connection
      const checkApolloConnection = async () => {
        try {
          // Simple connection check - just verify client exists and is healthy
          if (client && client.cache) {
            // Basic health check without making actual queries
            setStatus('connected');
          } else {
            setStatus('disconnected');
          }
        } catch (error) {
          logger.error('Connection check failed:', error);
          setStatus('error');
        }
        setLastUpdated(new Date());
      };

      // Check connection every 30 seconds
      const interval = setInterval(checkApolloConnection, 30000);

      return () => {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
        clearInterval(interval);
      };
    } catch (error) {
      logger.error('Error setting up ConnectionStatus:', error);
      setStatus('error');
    }
  }, [client]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setStatus('connecting');
    
    try {
      // Clear Apollo cache and retry
      if (client && client.clearStore) {
        await client.clearStore();
      }
      if (client && client.reFetchObservableQueries) {
        await client.reFetchObservableQueries();
      }
      setStatus('connected');
    } catch (error) {
      logger.error('Retry failed:', error);
      setStatus('error');
    } finally {
      setIsRetrying(false);
      setLastUpdated(new Date());
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Offline';
      case 'error':
        return 'Connection Error';
      default:
        return 'Unknown';
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <StatusContainer>
      <StatusIndicator status={status} />
      <StatusText status={status}>
        {getStatusText()}
      </StatusText>
      
      {status !== 'connected' && (
        <RetryButton 
          onClick={handleRetry} 
          disabled={isRetrying || status === 'connecting'}
        >
          {isRetrying ? 'Retrying...' : 'Retry'}
        </RetryButton>
      )}
      
      <LastUpdated>
        {formatTime(lastUpdated)}
      </LastUpdated>
    </StatusContainer>
  );
};

export default ConnectionStatus;