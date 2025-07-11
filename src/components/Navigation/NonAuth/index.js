import React, { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Header from '../../Header';
import * as routes from '../../../constants/routes';
import { Logo, StyledParagraph } from '../index';

const NavigationNonAuth = () => {
	const location = useLocation();

	const link = <Link to={routes.SIGN_IN}>Sign In</Link>;
	const fragment = <StyledParagraph>Code Talk Sign In</StyledParagraph>;

	const ConditionalLink = () => location.pathname !== '/signin' ? link : fragment;

	return <Fragment>
		<Header />
		<Logo>
			<ConditionalLink />
		</Logo>
	</Fragment>
};

export default NavigationNonAuth;