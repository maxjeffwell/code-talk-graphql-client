import React from 'react';
// import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import { MessageCreate, Messages } from '../Message';

// const StyledMessageList = styled.div`
//     border: 5px solid ${props => props.theme.black};
//     margin: auto 1rem;
//     height: auto;
//     width: auto;
//     display: grid;
//     max-width: 600px;
//     background: ${props => props.theme.white};
//     color: ${props => props.theme.black};
//     button {
//       cursor: pointer;
//       font-size: 1em;
//       margin: 5px 5px 5px;
//       padding: .25em 1em;
//       color: ${props => props.theme.green};
//       background: ${props => props.theme.black};
//       border: 5px solid ${props => props.theme.green};
//       border-radius: 5px;
//     }
//     button:hover {
//       box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px      25px 0 rgba(0,0,0,0.19);
//     }
// `;


const MessageContainer = ({ match }) => {

	const roomId = match.params.id;

	return <div>
		<MessageCreate />
		<Messages limit={10} roomId={roomId} />
	</div>;
};

export default withRouter(MessageContainer);
