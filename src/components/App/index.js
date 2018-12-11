import React from 'react';
import { Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import withSession from '../Session/withSession';
import Editor from '../Editor';

import * as routes from '../../constants/routes';
import history from '../../constants/history';
import { createGlobalStyle } from 'styled-components';

import WebFont from 'webfontloader';

WebFont.load({
  custom: {
    families: ['mr_robot'],
    urls: ['../../public/fonts/mr_robot.ttf']
  },
  timeout: 2000
});

const GlobalStyle = createGlobalStyle`
	@font-face {
		font-family: 'mr_robot';
		src: url('../../../public/fonts/mr_robot.ttf') format('truetype');
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
		font-family: 'mr_robot';
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
        path={routes.EDITOR}
        component={() => <Editor />}
      />

        </div>
      </Router>
);

export default withSession(App);
