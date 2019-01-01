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
import Monaco from '../Monaco';

import * as routes from '../../constants/routes';
import history from '../../constants/history';

WebFont.load({
  custom: {
    families: ['RussellSquareStd', 'SerpentineStd-Light', 'SerpentineStd-Medium', 'SerpentineStd-Bold', 'OratorStd', 'OCRAStd', 'FloodStd']
  },
  timeout: 2000
});

const GlobalStyle = createGlobalStyle`
	@font-face {
		font-family: RussellSquareStd;
		font-weight: normal;
		font-style: normal;
		src: src('../../../public/fonts/RussellSquareStd.otf') format('opentype');
	}
	
	@font-face {
	  font-family: SerpentineStd-Light;
	  src: url('../../../public/fonts/SerpentineStd-Light.otf') format('opentype');
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
	  font-family: SerpentineStd-Bold;
	  src: url('../../../public/fonts/SerpentineStd-Bold.otf') format('opentype');
	  font-weight: bold;
	  font-style: normal;
	}
	
	@font-face {
	  font-family: OratorStd;
	  src: url('../../../public/fonts/OratorStd.otf') format('opentype');
	  font-weight: normal;
	  font-style: normal;
	}
	
	@font-face {
	  font-family: OCRAStd;
	  src: url('../../../public/fonts/OCRAStd.otf') format('opentype');
	  font-weight: normal;
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
		font-size: 1.6rem;
		line-height: 1.6rem;
		font-family: RussellSquareStd, monospace;
	}
	`;

const App = ({ session, refetch }) => (
  <Router history={history}>
    <div className="routes">
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
      <Route
        exact
        path={routes.MONACO}
        component={() => <Monaco />}
        />

    </div>
  </Router>
);

export default withSession(App);
