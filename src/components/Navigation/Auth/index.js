import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

import Header from '../../Header';
import * as routes from '../../../constants/routes';
import SignOutButton from '../../SignOut';
import { Logo, StyledParagraph } from '../index';

const NavigationAuth = ({ session }) => {
	const location = useLocation();

	const link = <Link to={routes.ROOM}>Code Talk Chat</Link>;
	const ConditionalLink = () => location.pathname !== '/code-talk-chat/' ? link : Fragment;

	return <Fragment>
		<Header/>
		<Logo>
			<StyledParagraph>Current User: {session.me.username}</StyledParagraph>
		</Logo>
		<SignOutButton/>
		<Logo>
			<ConditionalLink />
		</Logo>
	</Fragment>;
};

NavigationAuth.propTypes = {
	session: PropTypes.object.isRequired,
};

export default NavigationAuth;