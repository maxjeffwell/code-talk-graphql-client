import React from 'react';
import styled from 'styled-components';

import MessageDelete from "../MessageDelete";
import withSession from "../../Session/withSession";

const StyledMessage = styled.li`
    border-top: 3px solid ${props => props.theme.black};
    margin: 5px auto;
    line-height: 1;
    overflow: auto;
    grid-column: 3;
    grid-row: 2;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 5px;
    display: flex;
    flex-direction: column-reverse;
`;

const StyledP = styled.p`
    word-wrap: break-word;
    width: 100%;
    line-height: 1;
    margin: 5px auto;
`;

const MessageItemBase = ({ message, session }) => (
	<StyledMessage>
		{session && session.me && message.user.id === session.me.id && (
			<MessageDelete message={message}/>
		)}
		<StyledP>Time: {message.createdAt}</StyledP>
		<StyledP>Username: {message.user.username}</StyledP>
		<StyledP>Message: {message.text}</StyledP>
	</StyledMessage>
);

export const MessageItem = withSession(MessageItemBase);