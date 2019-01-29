import React from 'react';
import styled from 'styled-components';

const StyledFooter = styled.footer`
	background: ${props => props.theme.green};
	color: ${props => props.theme.black};
	width: 100%;
	grid-row-start: 2;
	grid-row-end: 3;
`;

const Footer = () => (
		<StyledFooter class="footer" role="contentinfo">
			Copyright &copy; 2019 Code Talk
		</StyledFooter>
);

export default Footer;
