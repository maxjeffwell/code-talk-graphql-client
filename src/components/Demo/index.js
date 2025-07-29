import React from 'react';
import styled from 'styled-components';
import { breakpoint } from '../Variables';

const StyledDemo = styled.div`
	color: ${props => props.theme.green};
	background-color: ${props => props.theme.black};
	display: block;
	border: 3px solid ${props => props.theme.green};
	border-radius: 8px;
	padding: 1.5rem;
	font-family: RussellSquareStd, monospace;
	font-weight: bold;
	margin: 2rem auto;
	max-width: 400px;
	text-align: center;
	
	p {
		margin: 0.8rem 0;
		line-height: 1.4;
	}
	
	p:first-child {
		font-size: 1.1rem;
		margin-bottom: 1.2rem;
		text-decoration: underline;
	}
	
	span {
		display: block;
		margin: 0.3rem 0;
		font-size: 0.9rem;
	}
	
	@media (max-width: ${breakpoint.tablet}) {
		padding: 1.2rem;
		margin: 1.5rem auto;
		max-width: 90%;
	}
	
	@media (max-width: ${breakpoint.mobileL}) {
		padding: 1rem;
		margin: 1rem auto;
		max-width: 95%;
		font-size: 0.9rem;
	}
`;

const DemoAccounts = () => (
	<StyledDemo className="demos">
		<p>DEMO ACCOUNTS AVAILABLE</p>
		<p>
			<span>USERNAME: demo</span>
			<span>PASSWORD: demopassword</span>
		</p>
		<p>
			<span>USERNAME: demo2</span>
			<span>PASSWORD: demopassword</span>
		</p>
	</StyledDemo>
);

export default DemoAccounts;
