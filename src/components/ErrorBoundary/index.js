import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  min-height: 400px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 20px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
  color: #dc3545;
`;

const ErrorTitle = styled.h2`
  color: #343a40;
  margin-bottom: 10px;
  font-family: 'SerpentineStd-Medium', sans-serif;
`;

const ErrorMessage = styled.p`
  color: #6c757d;
  margin-bottom: 30px;
  max-width: 500px;
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  margin-top: 20px;
  max-width: 600px;
  text-align: left;
  
  summary {
    cursor: pointer;
    font-weight: bold;
    color: #495057;
    margin-bottom: 10px;
  }
  
  pre {
    background-color: #f1f3f4;
    padding: 15px;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 12px;
    color: #495057;
    white-space: pre-wrap;
    word-break: break-all;
  }
`;

const ActionButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin: 0 10px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0056b3;
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(ActionButton)`
  background-color: #6c757d;
  
  &:hover {
    background-color: #545b62;
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Generate a unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.setState({
      error,
      errorInfo,
      errorId
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error);
      console.error('Error info:', errorInfo);
    }

    // In production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo, errorId);
    }
  }

  logErrorToService = (error, errorInfo, errorId) => {
    // Example: Send to error tracking service
    try {
      // Replace with your error tracking service
      // Sentry.captureException(error, {
      //   contexts: {
      //     react: {
      //       componentStack: errorInfo.componentStack
      //     }
      //   },
      //   tags: {
      //     errorBoundary: this.props.name || 'Unknown'
      //   }
      // });
      
      console.error('Error logged to service:', { error, errorInfo, errorId });
    } catch (loggingError) {
      console.error('Failed to log error to service:', loggingError);
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, errorId: null });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback, showDetails = false } = this.props;
      
      // If a custom fallback is provided, use it
      if (Fallback) {
        return <Fallback 
          error={this.state.error} 
          errorInfo={this.state.errorInfo}
          reset={this.handleReset}
        />;
      }

      // Default error UI
      return (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>
            We're sorry, but something unexpected happened. 
            The error has been logged and our team will investigate.
          </ErrorMessage>
          
          <div>
            <ActionButton onClick={this.handleReset}>
              Try Again
            </ActionButton>
            <SecondaryButton onClick={this.handleGoHome}>
              Go Home
            </SecondaryButton>
            <SecondaryButton onClick={this.handleReload}>
              Reload Page
            </SecondaryButton>
          </div>

          {(showDetails || process.env.NODE_ENV === 'development') && this.state.error && (
            <ErrorDetails>
              <summary>Error Details (Click to expand)</summary>
              <div>
                <strong>Error ID:</strong> {this.state.errorId}
              </div>
              <div>
                <strong>Error:</strong> {this.state.error.toString()}
              </div>
              {this.state.errorInfo && (
                <div>
                  <strong>Component Stack:</strong>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </div>
              )}
              {this.state.error.stack && (
                <div>
                  <strong>Stack Trace:</strong>
                  <pre>{this.state.error.stack}</pre>
                </div>
              )}
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;