import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

import Header from '../../Header';
import * as routes from '../../../constants/routes';
import SignOutButton from '../../SignOut';
import { Logo, StyledParagraph } from '../index';

const NavigationAuth = ({ session }) => {
	const location = useLocation();

	const isOnChatPage = location.pathname === routes.CHAT;
	const isOnRoomsPage = location.pathname === routes.ROOMS;
	const isOnRoomPage = location.pathname.startsWith('/rooms/');

	return <Fragment>
		<Header/>
		<Logo>
			<StyledParagraph>Current User: {session.me.username}</StyledParagraph>
		</Logo>
		<SignOutButton/>
		<Logo>
			{!isOnChatPage && <Link to={routes.CHAT}>Main Chat</Link>}
			{!isOnChatPage && !isOnRoomsPage && <span> | </span>}
			{!isOnRoomsPage && <Link to={routes.ROOMS}>Chat Rooms</Link>}
			{isOnRoomsPage && isOnRoomPage && <span> | </span>}
			{isOnRoomPage && <Link to={routes.ROOMS}>Back to Rooms</Link>}
		</Logo>
	</Fragment>;
};

NavigationAuth.propTypes = {
	session: PropTypes.object.isRequired,
};

export default NavigationAuth;