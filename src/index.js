import React from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache, createHttpLink, split, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { ThemeProvider } from 'styled-components';

import App from './components/App';
import { signOut } from './components/SignOut';
import { getToken, isTokenExpired } from './utils/auth';
import { observeLongTasks } from './utils/performance';
import logger from './utils/logger';
import theme from './theme';

const httpLink = createHttpLink({
	uri: process.env.NODE_ENV === 'development' ? 'http://localhost:8000/graphql' : 'https://jmaxwell-code-talk-server.herokuapp.com/graphql'
});

const wsLink = new GraphQLWsLink(createClient({
	url: process.env.NODE_ENV === 'development' ? 'ws://localhost:8000/graphql' : 'wss://jmaxwell-code-talk-server.herokuapp.com/graphql',
	connectionParams: () => {
		const token = getToken();
		if (token && !isTokenExpired(token)) {
			return {
				'x-token': token,
			};
		}
		return {};
	},
}));

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return (
			definition.kind === 'OperationDefinition' &&
			definition.operation === 'subscription'
		);
	},
	wsLink,
	httpLink,
);

const authLink = setContext((_, { headers }) => {
	const token = getToken();
	console.log('Auth link - token found:', !!token);

	// Check if token is expired before using it
	if (token && !isTokenExpired(token)) {
		console.log('Auth link - sending token in headers');
		return {
			headers: {
				...headers,
				'x-token': token,
			}
		};
	} else if (token && isTokenExpired(token)) {
		console.log('Auth link - token expired, triggering logout');
		// Token is expired, trigger logout
		signOut(client, null);
	} else {
		console.log('Auth link - no valid token, sending headers without auth');
	}

	return { headers };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		graphQLErrors.forEach(({ message, locations, path }) => {
			logger.error('GraphQL error:', message, 'Location:', locations, 'Path:', path);

			if (message === 'Not authenticated.') {
				signOut(client, null);
			}
		});
	}

	if (networkError) {
		logger.error('Network error:', networkError);

		if (networkError.statusCode === 401) {
			signOut(client, null);
		}
	}
});

const cache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				messages: {
					keyArgs: false,
					merge(existing = { edges: [], pageInfo: {} }, incoming) {
						return {
							...incoming,
							edges: [...existing.edges, ...incoming.edges],
						};
					},
				},
			},
		},
		Message: {
			fields: {
				createdAt: {
					read(value) {
						return value ? new Date(value).toLocaleString() : '';
					},
				},
			},
		},
	},
	possibleTypes: {},
	resultCaching: true,
});

const client = new ApolloClient({
	link: from([authLink, errorLink, splitLink]),
	cache,
	connectToDevTools: true,
});


const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>
        </ThemeProvider>
    </React.StrictMode>
);

// Register service worker (disabled in development)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                logger.info('SW registered:', registration);
            })
            .catch((registrationError) => {
                logger.error('SW registration failed:', registrationError);
            });
    });
}

// Initialize performance monitoring
observeLongTasks();
