import React from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
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

const httpLink = createHttpLink({
	uri: process.env.NODE_ENV === 'development' ? 'http://localhost:8000/graphql' : 'https://jmaxwell-code-talk-server.herokuapp.com/graphql'
});

const wsLink = new GraphQLWsLink(createClient({
	url: process.env.NODE_ENV === 'development' ? 'ws://localhost:8000/graphql' : 'wss://jmaxwell-code-talk-server.herokuapp.com/graphql',
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

	// Check if token is expired before using it
	if (token && !isTokenExpired(token)) {
		return {
			headers: {
				...headers,
				'x-token': token,
			}
		};
	} else if (token && isTokenExpired(token)) {
		// Token is expired, trigger logout
		signOut(client, null);
	}

	return { headers };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		graphQLErrors.forEach(({ message, locations, path }) => {
			// Only log errors in development
			if (process.env.NODE_ENV === 'development') {
				console.log('GraphQL error', message);
			}

			if (message === 'Not authenticated.') {
				signOut(client, null);
			}
		});
	}

	if (networkError) {
		// Only log errors in development
		if (process.env.NODE_ENV === 'development') {
			console.log('Network error', networkError);
		}

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
	link: authLink.concat(errorLink).concat(splitLink),
	cache,
	connectToDevTools: true,
});

const theme = {
	green: '#30d403',
	black: '#393939',
	white: '#EDEDED',
};

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
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Initialize performance monitoring
observeLongTasks();
