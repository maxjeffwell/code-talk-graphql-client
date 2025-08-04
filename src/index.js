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
import { getToken, isTokenExpired } from './utils/auth';
import { observeLongTasks } from './utils/performance';
import logger from './utils/logger';
import theme from './theme';

const httpLink = createHttpLink({
	uri: window.location.hostname === 'localhost' ? 'http://localhost:8000/graphql' : 'https://code-talk-server-5f982138903e.herokuapp.com/graphql',
	fetchOptions: {
		mode: 'cors',
		credentials: 'include'
	}
});

// Create WebSocket client factory
const createWebSocketClient = () => {
	const token = getToken();
	console.log('[WebSocket] Creating client with token:', !!token);
	
	return createClient({
		url: window.location.hostname === 'localhost' ? 'ws://localhost:8000/graphql' : 'wss://code-talk-server-5f982138903e.herokuapp.com/graphql',
		connectionParams: () => {
			const currentToken = getToken();
			console.log('[WebSocket] Connection params - token:', !!currentToken);
			if (currentToken && !isTokenExpired(currentToken)) {
				console.log('[WebSocket] Sending token in connection params');
				return {
					'x-token': currentToken,
				};
			}
			console.log('[WebSocket] No valid token for connection params');
			return {};
		},
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

// Export function to reconnect WebSocket with new auth
export const reconnectWebSocket = async () => {
	console.log('[WebSocket] Reconnecting with new auth token');
	
	try {
		// Dispose of the old WebSocket connection
		if (wsClient) {
			wsClient.dispose();
		}
		
		// Create new WebSocket client with fresh auth
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
	connectToDevTools: true,
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
