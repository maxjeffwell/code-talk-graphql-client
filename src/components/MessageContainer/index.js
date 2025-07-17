import React, { Fragment } from 'react';

import { MessageCreate, Messages } from '../Message';
import Editor from '../Editor';
import * as Grid from '../Grid';

const Row = Grid.Row;
const Col = Grid.Column;

const MessageContainer = ({ roomId }) => {
	// If roomId is provided, render in room mode (messages only)
	// If no roomId, render in global chat mode (messages + code editor)
	if (roomId) {
		return <Fragment>
			<MessageCreate roomId={roomId} />
			<Messages limit={10} roomId={roomId} />
		</Fragment>;
	}

	// Global chat mode with code editor
	return (
		<Row>
			<Col colspan="1">
				<MessageCreate />
				<Messages limit={10} />
			</Col>
			<Col colspan="2" last>
				<Editor />
			</Col>
		</Row>
	);
};

// export default withRouter(MessageContainer);

export default MessageContainer;
