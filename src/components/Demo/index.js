import React from 'react';
import styled from 'styled-components';

const StyledDemo = styled.div`
	color: ${props => props.theme.green};
	background-color: ${props => props.theme.black};
	grid-template-rows: 1fr auto;
	display: inline-block;
	border: 5px solid ${props => props.theme.green};
	border-radius: 5px;
	padding: 5px 5px 5px 5px;
	font-family: RussellSquareStd, monospace;
	font-weight: bold;
`;

const DemoAccounts = () => (
	<StyledDemo className="demos">
		<p>DEMO ACCOUNTS AVAILABLE</p>
		<p>
			<span>USERNAME: demo </span>
			<span>PASSWORD: demopassword</span>
		</p>
		<p>
			<span>USERNAME: demo2 </span>
			<span>PASSWORD: demopassword</span>
		</p>
	</StyledDemo>
);

export default DemoAccounts;
