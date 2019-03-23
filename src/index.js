import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloLink, split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ThemeProvider } from 'styled-components';

import App from './components/App';
import { signOut } from './components/SignOut';

const httpLink = new HttpLink({
	uri: process.env.NODE_ENV === 'development' ? 'http://localhost:8000/graphql' : 'https://jmaxwell-code-talk-server.herokuapp.com/graphql'
});

const wsLink = new WebSocketLink({
	uri: process.env.NODE_ENV === 'development' ? `ws://localhost:8000/graphql` : `wss://jmaxwell-code-talk-server.herokuapp.com/graphql`,
	options: {
		reconnect: true,
	},
});

const terminatingLink = split(
	({ query }) => {
		const { kind, operation } = getMainDefinition(query);
		return (
			kind === 'OperationDefinition' && operation === 'subscription'
		);
	},
	wsLink,
	httpLink,
);

const authLink = new ApolloLink((operation, forward) => {
	operation.setContext(({ headers = {} }) => {
		const token = localStorage.getItem('token');

		if (token) {
			headers = { ...headers, 'x-token': token };
		}

		return { headers };
	});

	return forward(operation);
});

const createOmitTypenameLink = new ApolloLink((operation, forward) => {
	const omitTypename = (key, value) => {
		return key === '__typename' ? undefined : value
	};
	if (operation.variables) {
		operation.variables = JSON.parse(JSON.stringify(operation.variables), omitTypename)
	}
	return forward(operation)
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		graphQLErrors.forEach(({ message, locations, path }) => {
			console.log('GraphQL error', message);

			if (message === 'Not authenticated.') {
				signOut(client);
			}
		});
	}

	if (networkError) {
		console.log('Network error', networkError);

		if (networkError.statusCode === 401) {
			signOut(client);
		}
	}
});

const link = ApolloLink.from([authLink, createOmitTypenameLink, errorLink, terminatingLink]);

const cache = new InMemoryCache();

const client = new ApolloClient({
	link,
	cache,
	connectToDevTools: true,
});

const theme = {
	green: '#30d403',
	black: '#393939',
	white: '#EDEDED',
};

ReactDOM.render(
    <ThemeProvider theme={theme}>
			<ApolloProvider client={client}>
				<App />
			</ApolloProvider>
		</ThemeProvider>,
	document.getElementById('root'),
);
