import React, { Component } from 'react';

import { MessageItem } from "../MessageItem";
import gql from "graphql-tag";

const MESSAGE_CREATED_SUBSCRIPTION = gql`
    subscription messageCreatedSubscription {
        messageCreated {
            message {
                id
                text
                createdAt
                user {
                    id
                    username
                }
            }
        }
    }
`;

class MessageList extends Component {
	componentDidMount() {
		this.props.subscribeToMore({
			document: MESSAGE_CREATED_SUBSCRIPTION,
			updateQuery: (previousResult, {subscriptionData}) => {
				if (!subscriptionData.data) {
					return previousResult;
				}

				const {messageCreated} = subscriptionData.data;

				return {
					...previousResult,
					messages: {
						...previousResult.messages,
						edges: [
							messageCreated.message,
							...previousResult.messages.edges,
						],
					},
				};
			},
		});
	}

	componentWillUnmount() {
		if (this.unsubscribe) {
			this.unsubscribe();
		}
	}

	render() {
		const { messages } = this.props;
		return messages.map(message => (
			<MessageItem key={message.id} message={message}/>
		));
	}
}

export default MessageList;