import React, { createContext, useContext, useReducer, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
  pointer-events: none;
  
  @media (max-width: 768px) {
    left: 20px;
    right: 20px;
    max-width: none;
  }
`;

const NotificationItemWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
  cursor: pointer;
  animation: ${props => css`${props.isExiting ? slideOut : slideIn} 0.3s ease-out`};
  
  background-color: ${props => {
    switch (props.type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return '#d4edda';
      case NOTIFICATION_TYPES.ERROR:
        return '#f8d7da';
      case NOTIFICATION_TYPES.WARNING:
        return '#fff3cd';
      case NOTIFICATION_TYPES.INFO:
      default:
        return '#d1ecf1';
    }
  }};
  
  border-left: 4px solid ${props => {
    switch (props.type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return '#28a745';
      case NOTIFICATION_TYPES.ERROR:
        return '#dc3545';
      case NOTIFICATION_TYPES.WARNING:
        return '#ffc107';
      case NOTIFICATION_TYPES.INFO:
      default:
        return '#17a2b8';
    }
  }};
  
  color: ${props => {
    switch (props.type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return '#155724';
      case NOTIFICATION_TYPES.ERROR:
        return '#721c24';
      case NOTIFICATION_TYPES.WARNING:
        return '#856404';
      case NOTIFICATION_TYPES.INFO:
      default:
        return '#0c5460';
    }
  }};
`;

const NotificationIcon = styled.div`
  margin-right: 12px;
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
`;

const NotificationMessage = styled.div`
  font-size: 14px;
  line-height: 1.4;
`;

const NotificationActions = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: 1px solid currentColor;
  color: inherit;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  margin-left: 8px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 0 0 8px 8px;
  width: ${props => props.progress}%;
  transition: width 0.1s linear;
`;

// Notification reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return [...state, { ...action.payload, id: Date.now() + Math.random() }];
    case 'REMOVE_NOTIFICATION':
      return state.filter(notification => notification.id !== action.payload);
    case 'CLEAR_ALL':
      return [];
    default:
      return state;
  }
};

// Context
const NotificationContext = createContext();

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, dispatch] = useReducer(notificationReducer, []);

  const addNotification = (notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const removeNotification = (id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const clearAll = () => {
    dispatch({ type: 'CLEAR_ALL' });
  };

  // Helper functions for different notification types
  const success = (message, options = {}) => {
    addNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      message,
      icon: '✅',
      ...options
    });
  };

  const error = (message, options = {}) => {
    addNotification({
      type: NOTIFICATION_TYPES.ERROR,
      message,
      icon: '❌',
      duration: 10000, // Error messages stay longer
      ...options
    });
  };

  const warning = (message, options = {}) => {
    addNotification({
      type: NOTIFICATION_TYPES.WARNING,
      message,
      icon: '⚠️',
      ...options
    });
  };

  const info = (message, options = {}) => {
    addNotification({
      type: NOTIFICATION_TYPES.INFO,
      message,
      icon: 'ℹ️',
      ...options
    });
  };

  const contextValue = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer>
        {notifications.map(notification => (
          <NotificationItemComponent key={notification.id} notification={notification} />
        ))}
      </NotificationContainer>
    </NotificationContext.Provider>
  );
};

// Individual notification component
const NotificationItemComponent = ({ notification }) => {
  const { removeNotification } = useContext(NotificationContext);
  const [progress, setProgress] = React.useState(100);
  const [isExiting, setIsExiting] = React.useState(false);

  const duration = notification.duration || 5000;
  const showProgress = notification.showProgress !== false;

  useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 100));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);

      const timeout = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeNotification(notification.id);
    }, 300);
  };

  return (
    <NotificationItemWrapper
      type={notification.type}
      isExiting={isExiting}
      onClick={() => notification.onClick && notification.onClick()}
    >
      {notification.icon && (
        <NotificationIcon>{notification.icon}</NotificationIcon>
      )}
      <NotificationContent>
        {notification.title && (
          <NotificationTitle>{notification.title}</NotificationTitle>
        )}
        <NotificationMessage>{notification.message}</NotificationMessage>
        {notification.actions && (
          <NotificationActions>
            {notification.actions.map((action, index) => (
              <ActionButton
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
              >
                {action.label}
              </ActionButton>
            ))}
          </NotificationActions>
        )}
      </NotificationContent>
      <CloseButton onClick={handleClose}>×</CloseButton>
      {showProgress && duration > 0 && (
        <ProgressBar progress={progress} />
      )}
    </NotificationItemWrapper>
  );
};

// Hook to use notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationProvider;