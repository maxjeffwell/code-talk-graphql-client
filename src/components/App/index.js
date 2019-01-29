import React from 'react';
import { Router, Route } from 'react-router-dom';

import { createGlobalStyle } from 'styled-components';
import WebFont from 'webfontloader';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import withSession from '../Session/withSession';
import RoomList  from '../Room/RoomList';
import Room from '../Room';

import * as routes from '../../constants/routes';
import history from '../../constants/history';

WebFont.load({
  custom: {
    families: ['RussellSquareStd', 'SerpentineStd-Medium', 'FloodStd']
  },
  timeout: 2000
});

const GlobalStyle = createGlobalStyle`
	@font-face {
		font-family: RussellSquareStd;
		src: url('../../../public/fonts/RussellSquareStd.otf') format('opentype');
		font-weight: normal;
		font-style: normal;
	}
	
  @font-face {
	  font-family: SerpentineStd-Medium;
	  src: url('../../../public/fonts/SerpentineStd-Medium.otf') format('opentype');
	  font-weight: 300;
	  font-style: normal;
	}

  @font-face {
	  font-family: FloodStd;
	  src: url('../../../public/fonts/FloodStd.otf') format('opentype');
	  font-weight: normal;
	  font-style: normal;
	}

html {
		box-sizing: border-box; // set box sizing on root of doc in html
		font-size: 10px; // set font at base-10
	}
	
*, *:before, *:after {
		box-sizing: inherit; // then inherit box sizing on everything else
	}
	
body {
		padding: 0;
		margin: 0;
		font-size: 1.5rem;
		line-height: 2;
		font-family: RussellSquareStd, monospace;
	}
`;

const App = ({ session, refetch }) => (
  <Router history={history}>
    <div className="routes" role="navigation">
      <Navigation session={session} />
      <GlobalStyle />

      <Route
        exact
        path={routes.LANDING}
        component={() => <LandingPage />}
      />

      <Route
        exact
        path={routes.SIGN_UP}
        component={() => <SignUpPage refetch={refetch} />}
      />

      <Route
        exact
        path={routes.SIGN_IN}
        component={() => <SignInPage refetch={refetch} />}
      />

      <Route
        exact
        path={routes.ACCOUNT}
        component={() => <AccountPage />}
      />

      <Route
        exact
        path={routes.ADMIN}
        component={() => <AdminPage />}
      />

      <Route
        exact
        path={routes.ROOMS}
        component={() => <RoomList />}
      />

      <Route
        path={routes.ROOM}
        component={() => <Room />}
      />

        </div>
  </Router>
);

export default withSession(App);
