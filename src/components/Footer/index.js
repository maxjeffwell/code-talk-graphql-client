import React from 'react';
import styled from 'styled-components';

const StyledFooter = styled.footer`
	background: ${props => props.theme.green};
	color: ${props => props.theme.black};
	width: 100%;
	grid-row-start: 2;
	grid-row-end: 3;
	padding: 1em;
	text-align: center;
	font-weight: bold;
`;

const Footer = () => (
		<StyledFooter className="footer">
			Copyright &copy; 2025 Code Talk
		</StyledFooter>
);

export default Footer;
