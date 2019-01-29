import styled, { keyframes } from 'styled-components';

const rotate360 = keyframes`
	from {
		transform: rotate(0);
	}
	
	to {
		transform: rotate(360deg);
	}
`;

const Spinner = styled.div`
	height: 70px;
	width: 70px;
	border-radius: 50%;
	border: 5px solid ${props => props.theme.green};
	border-top-color: transparent;
	
	animation: ${rotate360} 1s linear infinite;
`;

export default Spinner;
