import React from 'react';
import styled from 'styled-components';

import { MessageCreate, Messages } from '../Message';
import Editor from '../Editor';
import { breakpoint } from '../Variables';

const ChatContainer = styled.div`
  background: ${props => props.theme.black};
  color: ${props => props.theme.green};
  border: 5px solid ${props => props.theme.green};
  border-radius: 5px;
  min-height: calc(100vh - 80px);
  margin: 40px 20px 20px 20px;
  display: flex;
  overflow: hidden;
  
  @media (max-width: ${breakpoint.tablet}) {
    margin: 30px 15px 15px 15px;
    border-width: 3px;
    min-height: calc(100vh - 60px);
    flex-direction: column;
  }
  
  @media (max-width: ${breakpoint.mobileL}) {
    margin: 20px 10px 10px 10px;
    border-width: 2px;
    border-radius: 3px;
    min-height: calc(100vh - 40px);
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-right: 3px solid ${props => props.theme.green};
  overflow: hidden;
  
  @media (max-width: ${breakpoint.tablet}) {
    border-right: none;
    border-bottom: 3px solid ${props => props.theme.green};
    flex: none;
    height: 50vh;
  }
`;

const RightPanel = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  @media (max-width: ${breakpoint.tablet}) {
    flex: 1;
  }
`;

const RoomContainer = styled.div`
  background: ${props => props.theme.black};
  color: ${props => props.theme.green};
  border: 5px solid ${props => props.theme.green};
  border-radius: 5px;
  min-height: calc(100vh - 80px);
  margin: 40px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  overflow: hidden;
  
  @media (max-width: ${breakpoint.tablet}) {
    margin: 30px 15px 15px 15px;
    border-width: 3px;
    min-height: calc(100vh - 60px);
  }
  
  @media (max-width: ${breakpoint.mobileL}) {
    margin: 20px 10px 10px 10px;
    border-width: 2px;
    border-radius: 3px;
    min-height: calc(100vh - 40px);
  }
`;

const MessageContainer = ({ roomId }) => {
	// If roomId is provided, render in room mode (messages only)
	// If no roomId, render in global chat mode (messages + code editor)
	if (roomId) {
		return (
			<RoomContainer>
				<MessageCreate roomId={roomId} />
				<Messages limit={10} roomId={roomId} />
			</RoomContainer>
		);
	}

	// Global chat mode with code editor
	return (
		<ChatContainer>
			<LeftPanel>
				<MessageCreate />
				<Messages limit={10} />
			</LeftPanel>
			<RightPanel>
				<Editor />
			</RightPanel>
		</ChatContainer>
	);
};

// export default withRouter(MessageContainer);

export default MessageContainer;
