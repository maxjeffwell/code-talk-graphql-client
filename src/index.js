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
import { HelmetProvider } from 'react-helmet-async';

import App from './components/App';
import { signOut } from './components/SignOut';
import { observeLongTasks } from './utils/performance';
import logger from './utils/logger';
import theme from './theme';
// Note: Authentication now uses httpOnly cookies - no client-side token management needed

const httpLink = createHttpLink({
	uri: process.env.REACT_APP_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8000/graphql' : '/graphql'),
	fetchOptions: {
		mode: 'cors',
		credentials: 'include'
	}
});

// Create WebSocket client factory
// Authentication uses httpOnly cookies sent with the HTTP upgrade request
const createWebSocketClient = () => {
	console.log('[WebSocket] Creating client (auth via httpOnly cookies)');

	// Derive WebSocket URL from API base URL or use defaults
	const getWsUrl = () => {
		if (process.env.REACT_APP_API_BASE_URL) {
			return process.env.REACT_APP_API_BASE_URL.replace(/^http/, 'ws');
		}
		return window.location.hostname === 'localhost'
			? 'ws://localhost:8000/graphql'
			: `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/graphql`;
	};

	return createClient({
		url: getWsUrl(),
		// No connectionParams needed - auth is via httpOnly cookies in HTTP upgrade
		shouldRetry: () => true,
		retryAttempts: 5,
		on: {
			connected: () => console.log('[WebSocket] Connected'),
			error: (error) => console.error('[WebSocket] Error:', error),
			closed: () => console.log('[WebSocket] Closed'),
		},
	});
};

let wsClient = createWebSocketClient();
let wsLink = new GraphQLWsLink(wsClient);

// Store references for reconnection
let apolloClient = null;
let splitLinkRef = null;

// Export function to reconnect WebSocket after auth change
// This is needed because httpOnly cookies are only sent with the initial HTTP upgrade
export const reconnectWebSocket = async () => {
	console.log('[WebSocket] Reconnecting to pick up new auth cookies');

	try {
		// Dispose of the old WebSocket connection
		if (wsClient) {
			wsClient.dispose();
		}

		// Create new WebSocket client - will use current cookies for auth
		wsClient = createWebSocketClient();
		wsLink = new GraphQLWsLink(wsClient);

		// Recreate the split link with the new WebSocket link
		splitLinkRef = split(
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

		// Update Apollo Client with new link
		if (apolloClient) {
			console.log('[WebSocket] Updating Apollo Client link');
			apolloClient.setLink(from([authLink, errorLink, splitLinkRef]));
		}

		console.log('[WebSocket] Reconnection complete');
	} catch (error) {
		console.error('[WebSocket] Error during reconnection:', error);
	}
};

splitLinkRef = split(
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

// Helper function to read cookies by name
const getCookie = (name) => {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
	return null;
};

// Auth link handles CSRF protection for mutations
// Authentication uses httpOnly cookies sent automatically via credentials: 'include'
const authLink = setContext((operation, { headers }) => {
	// Read CSRF token from cookie and add to header
	// The server sets this cookie on GET requests
	const csrfToken = getCookie('csrf-token');

	return {
		headers: {
			...headers,
			...(csrfToken && { 'x-csrf-token': csrfToken }),
		},
	};
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		graphQLErrors.forEach(({ message, locations, path }) => {
			logger.error('GraphQL error:', message, 'Location:', locations, 'Path:', path);

			if (message === 'Not authenticated.' || message === 'Not authenticated as a user') {
				console.log('[Auth] Authentication error detected, signing out');
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
					keyArgs: ["roomId"], // Include roomId in cache key to separate messages by room
					merge(existing = { edges: [], pageInfo: {} }, incoming, { args }) {
						// Only merge if it's a pagination request (has cursor)
						if (args.cursor) {
							return {
								...incoming,
								edges: [...existing.edges, ...incoming.edges],
							};
						}
						// For initial queries, replace entirely
						return incoming;
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
	link: from([authLink, errorLink, splitLinkRef]),
	cache,
	devtools: {
		enabled: true
	},
});

// Store reference for reconnection
apolloClient = client;


const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <HelmetProvider>
            <ThemeProvider theme={theme}>
                <ApolloProvider client={client}>
                    <App />
                </ApolloProvider>
            </ThemeProvider>
        </HelmetProvider>
    </React.StrictMode>
);

// Service worker cleanup completely disabled to prevent reload loops
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.getRegistrations().then(function(registrations) {
//         registrations.forEach(function(registration) {
//             registration.unregister();
//             console.log('Service worker unregistered');
//         });
//     });
//     
//     if ('caches' in window) {
//         caches.keys().then(function(cacheNames) {
//             cacheNames.forEach(function(cacheName) {
//                 caches.delete(cacheName);
//                 console.log('Cache cleared:', cacheName);
//             });
//         });
//     }
// }

// Initialize performance monitoring
observeLongTasks();

// Force rebuild timestamp
console.log('App initialized at:', new Date().toISOString());
