import React, { Fragment } from 'react';
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
	// uri: 'http://localhost:8000/graphql'
});

const wsLink = new WebSocketLink({
	uri: process.env.NODE_ENV === 'development' ? `ws://localhost:8000/graphql` : `wss://jmaxwell-code-talk-server.herokuapp.com/graphql`,
	// uri: `ws://localhost:8000/graphql`,
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
	operation.setContext(
		({
			 headers = {},
			 localToken = localStorage.getItem('token')
		 }) => {
			if (localToken) {
				headers['x-token'] = localToken;
			}
			return {
				headers,
			};
		},
	);

	return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		graphQLErrors.forEach(({ message, locations, path }) => {
			console.log('GraphQL error', message);

			if (message === 'NOT_AUTHENTICATED') {
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

const link = ApolloLink.from([authLink, errorLink, terminatingLink]);

const cache = new InMemoryCache();

const client = new ApolloClient({
	link,
	cache,
});

const theme = {
	green: '#30d403',
	black: '#393939',
	white: '#EDEDED',
	maxWidth: '1000px',
	bs: '0 12px 24px 0 rgba(0, 0, 0, 0.99)'
};

ReactDOM.render(
  <Fragment>
    <ThemeProvider theme={theme}>
			<ApolloProvider client={client}>
				<App />
			</ApolloProvider>
		</ThemeProvider>
  </Fragment>,
	document.getElementById('root'),
);
