import React, { memo, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import styled from 'styled-components';
import MessageDelete from './MessageDelete';
import withSession from '../Session/withSession';

const StyledMessage = styled.div`
  border-top: 3px solid ${props => props.theme.black};
  margin: 5px auto;
  line-height: 1;
  overflow: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledP = styled.p`
  word-wrap: break-word;
  width: 100%;
  line-height: 1;
  margin: 5px auto;
`;

const ListContainer = styled.div`
  height: 400px;
  width: 100%;
  overflow: auto;
`;

const MessageItem = memo(({ index, style, data }) => {
  const { messages, session } = data;
  const message = messages[index];

  const isOwner = useMemo(() => 
    session && session.me && message.user.id === session.me.id, 
    [session, message.user.id]
  );

  return (
    <div style={style}>
      <StyledMessage>
        {isOwner && (
          <MessageDelete message={message}/>
        )}
        <StyledP>Time: {message.createdAt}</StyledP>
        <StyledP>Username: {message.user.username}</StyledP>
        <StyledP>Message: {message.text}</StyledP>
      </StyledMessage>
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

const VirtualizedMessageList = memo(({ messages, session }) => {
  const itemData = useMemo(() => ({
    messages,
    session
  }), [messages, session]);

  if (!messages || messages.length === 0) {
    return (
      <div>
        <p>No messages have been created yet ... Create one here ...</p>
      </div>
    );
  }

  return (
    <ListContainer>
      <List
        height={400}
        itemCount={messages.length}
        itemSize={120}
        itemData={itemData}
        overscanCount={5}
      >
        {MessageItem}
      </List>
    </ListContainer>
  );
});

VirtualizedMessageList.displayName = 'VirtualizedMessageList';

export default withSession(VirtualizedMessageList);