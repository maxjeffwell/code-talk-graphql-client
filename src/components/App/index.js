import React, { Fragment } from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import { createGlobalStyle } from 'styled-components';
import WebFont from 'webfontloader';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import withSession from '../Session/withSession';
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
		font-size: 1.5rem;
		line-height: 2;
		font-family: RussellSquareStd, monospace;
	}
`;

const App = ({ session, refetch }) => (
  <Router history={history}>
    <Fragment>
      <Navigation session={session} />
      <GlobalStyle />
      <Switch>

      <Route exact path={routes.LANDING} component={LandingPage} />

      <Route exact path={routes.SIGN_UP} render={props => <SignUpPage {...props} refetch={refetch} />} />

      <Route exact path={routes.SIGN_IN} render={props=> <SignInPage {...props} refetch={refetch} />}  />

      <Route excact path={routes.ROOM} render={props => <Room {...props} />} />>

      </Switch>
    </Fragment>
  </Router>
);

export default withSession(App);
