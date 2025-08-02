import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { createGlobalStyle } from 'styled-components';
import WebFont from 'webfontloader';

import Navigation from '../Navigation';
import LoadingSpinner from '../Loading/LoadingSpinner';
import ErrorBoundary from '../ErrorBoundary';
import { NotificationProvider } from '../Notifications/NotificationSystem';
import ConnectionStatus from '../ConnectionStatus';
import withSession from '../Session/withSession';
import { setNavigationInstance } from '../../utils/navigation';

import * as routes from '../../constants/routes';

// Lazy load route components for better performance
const LandingPage = React.lazy(() => import('../Landing'));
const SignUpPage = React.lazy(() => import('../SignUp'));
const SignInPage = React.lazy(() => import('../SignIn'));
const Room = React.lazy(() => import('../Room'));
const RoomList = React.lazy(() => import('../Room/RoomList'));
const MessageContainer = React.lazy(() => import('../MessageContainer'));

// Lazy load heavy components (prepared for future implementation)
// const MessagesList = React.lazy(() => import('../Message/Messages'));
// const Editor = React.lazy(() => import('../Editor'));
// const UserList = React.lazy(() => import('../UserList'));

// Optimized font loading with display swap and preload
WebFont.load({
  custom: {
    families: ['RussellSquareStd', 'SerpentineStd-Medium', 'FloodStd']
  },
  timeout: 2000,
  fontdisplay: 'swap',
  loading: () => {
    // Add font loading class for better FOUT handling
    document.documentElement.classList.add('fonts-loading');
  },
  active: () => {
    // Remove loading class when fonts are loaded
    document.documentElement.classList.remove('fonts-loading');
    document.documentElement.classList.add('fonts-loaded');
  },
  inactive: () => {
    // Handle font loading failure
    document.documentElement.classList.remove('fonts-loading');
    document.documentElement.classList.add('fonts-failed');
  }
});

const GlobalStyle = createGlobalStyle`
	@font-face {
		font-family: RussellSquareStd;
		src: url('/fonts/RussellSquareStd.otf') format('opentype');
		font-weight: normal;
		font-style: normal;
		font-display: swap;
	}
	
  @font-face {
	  font-family: SerpentineStd-Medium;
	  src: url('/fonts/SerpentineStd-Medium.otf') format('opentype');
	  font-weight: 300;
	  font-style: normal;
	  font-display: swap;
	}

  @font-face {
	  font-family: FloodStd;
	  src: url('/fonts/FloodStd.otf') format('opentype');
	  font-weight: normal;
	  font-style: normal;
	  font-display: swap;
	}

html {
		box-sizing: border-box;
		font-size: 14px;
	}
	
*, *:before, *:after {
		box-sizing: inherit;
	}
	
body {
		padding: 0;
		margin: 0;
		font-size: 1rem;
		line-height: 1.6;
		font-family: RussellSquareStd, monospace;
		
		/* Optimize font loading states */
		opacity: 1;
		transition: opacity 0.3s ease;
	}
	
	.fonts-loading body {
		opacity: 0.8;
	}
	
	.fonts-loaded body {
		opacity: 1;
	}
	
	.fonts-failed body {
		font-family: monospace; /* Fallback font */
	}
`;

const AppRoutes = ({ session, refetch }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Register navigation instance for use throughout the app
    setNavigationInstance(navigate);
  }, [navigate]);

  return (
    <div className="routes" role="navigation">
      <Helmet>
        <title>Code Talk - Real-time Code Collaboration Platform</title>
        <meta name="description" content="Join Code Talk for real-time collaborative coding, live chat, and seamless project sharing with developers worldwide." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <GlobalStyle />
      <ConnectionStatus />
      <Navigation session={session} />

      <ErrorBoundary name="Routes">
        <Suspense fallback={<LoadingSpinner text="Loading page..." minHeight="400px" />}>
          <Routes>
            <Route
              path={routes.LANDING}
              element={<LandingPage />}
            />

            <Route
              path={routes.SIGN_UP}
              element={<SignUpPage refetch={refetch} />}
            />

            <Route
              path={routes.SIGN_IN}
              element={<SignInPage refetch={refetch} />}
            />

            <Route
              path={routes.CHAT}
              element={<MessageContainer />}
            />

            <Route
              path={routes.ROOMS}
              element={<RoomList />}
            />

            <Route
              path={routes.ROOM}
              element={<Room />}
            />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

const App = ({ session, refetch }) => (
  <ErrorBoundary name="App">
    <NotificationProvider>
      <BrowserRouter>
        <AppRoutes session={session} refetch={refetch} />
      </BrowserRouter>
    </NotificationProvider>
  </ErrorBoundary>
);

export default withSession(App);
