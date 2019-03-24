import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

import Header from '../../Header';
import * as routes from '../../../constants/routes';
import { Logo, StyledParagraph } from '../index';

class NavigationNonAuth extends Component {
	static propTypes = {
		location: PropTypes.object.isRequired,
	};

	render() {

		const { location } = this.props;

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
}

export default withRouter(NavigationNonAuth);