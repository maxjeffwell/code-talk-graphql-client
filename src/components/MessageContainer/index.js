import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { MessageCreate, Messages } from '../Message';
import Editor from '../Editor';
import SignOutButton from '../SignOut';
import { breakpoint } from '../Variables';
import * as routes from '../../constants/routes';

const ChatContainer = styled.div`
  background: ${props => props.theme.black};
  color: ${props => props.theme.green};
  border: 5px solid ${props => props.theme.green};
  border-radius: 5px;
  min-height: calc(100vh - 80px);
  margin: 40px 20px 20px 20px;
  display: flex;
  flex-direction: column;
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

const ChatContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  
  @media (max-width: ${breakpoint.tablet}) {
    flex-direction: column;
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

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid ${props => props.theme.green};
  
  @media (max-width: ${breakpoint.tablet}) {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: ${breakpoint.tablet}) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.green};
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  border: 2px solid ${props => props.theme.green};
  border-radius: 3px;
  font-size: 1.1rem;
  font-weight: bold;
  text-transform: uppercase;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.green};
    color: ${props => props.theme.black};
  }

  @media (max-width: ${breakpoint.mobileL}) {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
`;

const Title = styled.h2`
  color: ${props => props.theme.green};
  font-size: 1.2rem;
  margin: 0;
  text-transform: uppercase;
  
  @media (max-width: ${breakpoint.mobileL}) {
    font-size: 1rem;
  }
`;

const MessageContainer = ({ roomId }) => {
	// If roomId is provided, render in room mode (messages only)
	// If no roomId, render in global chat mode (messages + code editor)
	if (roomId) {
		return (
			<RoomContainer>
				<TopBar>
					<Title>Room Chat</Title>
					<Navigation>
						<NavLink to={routes.CHAT}>Main Chat</NavLink>
						<NavLink to={routes.ROOMS}>All Rooms</NavLink>
					</Navigation>
				</TopBar>
				<MessageCreate roomId={roomId} />
				<Messages limit={10} roomId={roomId} />
			</RoomContainer>
		);
	}

	// Global chat mode with code editor
	return (
		<ChatContainer>
			<TopBar>
				<Title>Code Talk Chat</Title>
				<Navigation>
					<NavLink to={routes.ROOMS}>Chat Rooms</NavLink>
				</Navigation>
			</TopBar>
			<ChatContent>
				<LeftPanel>
					<MessageCreate />
					<Messages limit={10} />
				</LeftPanel>
				<RightPanel>
					<Editor />
				</RightPanel>
			</ChatContent>
		</ChatContainer>
	);
};

// export default withRouter(MessageContainer);

export default MessageContainer;
