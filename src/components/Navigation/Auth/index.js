import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

import Header from '../../Header';
import * as routes from '../../../constants/routes';
import SignOutButton from '../../SignOut';
import { Logo, StyledParagraph } from '../index';

class NavigationAuth extends Component {
	static propTypes = {
		location: PropTypes.object.isRequired,
	};

	render() {

		const { location, session } = this.props;

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
}

export default withRouter(NavigationAuth);