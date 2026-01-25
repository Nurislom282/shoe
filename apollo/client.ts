import { useMemo } from 'react';
import { ApolloClient, ApolloLink, InMemoryCache, split, from, NormalizedCacheObject } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { getJwtToken } from '../libs/auth';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { sweetErrorAlert } from '../libs/sweetAlert';
import { socketVar } from './store';
let apolloClient: ApolloClient<NormalizedCacheObject>;

function getHeaders(): HeadersInit {
	const headers: Record<string, string> = {};
	const token = getJwtToken();
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}
	return headers as HeadersInit;
}

const tokenRefreshLink = new TokenRefreshLink({
	accessTokenField: 'accessToken',
	isTokenValidOrUndefined: () => {
		return true;
	},
	fetchAccessToken: () => {
		// execute refresh token
		return fetch('') as any;
	},
	handleFetch: () => { },
	handleError: () => { },
} as any);

// Custom WebSocket client
class LoggingWebSocket {
	private socket: WebSocket;
	constructor(url: string) {
		this.socket = new WebSocket(`${url}?token=${getJwtToken()}`);
		socketVar(this.socket);

		this.socket.onopen = () => {
			// WebSocket connection established
		};

		this.socket.onmessage = () => {
			// WebSocket message received
		};

		this.socket.onerror = () => {
			// WebSocket error occurred
		};
	}

	send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView) {
		this.socket.send(data);
	}

	close() {
		this.socket.close();
	}
}

function createIsomorphicLink() {
	const graphqlUrl = process.env.NEXT_PUBLIC_API_GRAPHQL_URL ||
		process.env.REACT_APP_API_GRAPHQL_URL ||
		'http://localhost:4004/graphql';

	if (!graphqlUrl || graphqlUrl === 'undefined') {
		console.error('GraphQL URL is not configured. Please set NEXT_PUBLIC_API_GRAPHQL_URL or REACT_APP_API_GRAPHQL_URL');
	}

	if (typeof window !== 'undefined') {
		console.log('=== Apollo Client Configuration ===');
		console.log('GraphQL URL:', graphqlUrl);
		console.log('Environment Variables:', {
			NEXT_PUBLIC_API_GRAPHQL_URL: process.env.NEXT_PUBLIC_API_GRAPHQL_URL,
			REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL,
		});

		// Test connectivity
		fetch(graphqlUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ query: '{ __typename }' }),
		})
			.then((response) => {
				console.log('Backend connectivity test:', response.ok ? '✅ Connected' : `❌ Error: ${response.status}`);
				if (!response.ok) {
					console.error('Response status:', response.status, response.statusText);
				}
			})
			.catch((error) => {
				console.error('❌ Backend connectivity test failed:', error.message);
				console.error('Make sure your backend server is running on:', graphqlUrl);
			});
	}

	const authLink = new ApolloLink((operation, forward) => {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			...(getHeaders() as Record<string, string>),
		};

		if (typeof window !== 'undefined') {
			console.log('Apollo Request:', {
				operation: operation.operationName,
				variables: operation.variables,
				url: graphqlUrl,
				headers: { ...headers, Authorization: headers.Authorization ? 'Bearer ***' : 'none' }
			});
		}

		operation.setContext(({ headers: existingHeaders = {} }) => ({
			headers: {
				...existingHeaders,
				...headers,
			},
		}));
		return forward(operation);
	});

	const httpLink = createUploadLink({
		uri: graphqlUrl,
		fetchOptions: {
			credentials: 'include',
			mode: 'cors',
		},
		fetch,
	});

	// Only create WebSocket link on client side
	if (typeof window !== 'undefined') {
		const wsUrl = process.env.NEXT_PUBLIC_API_WS ||
			process.env.REACT_APP_API_WS ||
			'ws://127.0.0.1:4004';

		const wsLink = new WebSocketLink({
			uri: wsUrl,
			options: {
				reconnect: true,
				timeout: 30000,
				connectionParams: () => {
					return { headers: getHeaders() };
				},
			},
			webSocketImpl: LoggingWebSocket,
		});

		const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
			if (graphQLErrors) {
				graphQLErrors.forEach(({ message, extensions, path }) => {
					console.error('GraphQL Error:', {
						message,
						extensions,
						path,
						operation: operation?.operationName
					});
					if (!message.includes('input')) {
						sweetErrorAlert(message);
					}
				});
			}
			if (networkError) {
				const statusCode = (networkError as { statusCode?: number }).statusCode;
				const errorMessage = (networkError as { message?: string }).message || '';
				const result = (networkError as { result?: any }).result;

				console.error('Network Error Details:', {
					statusCode,
					message: errorMessage,
					operation: operation?.operationName,
					variables: operation?.variables,
					url: graphqlUrl,
					result: result,
					error: networkError
				});

				// Check for CORS errors
				if (errorMessage.includes('CORS') || errorMessage.includes('cors') ||
					errorMessage.includes('Access-Control-Allow-Origin') ||
					errorMessage.includes('preflight')) {
					console.error('CORS Error Detected!');
					sweetErrorAlert(`CORS Error: The backend server at ${graphqlUrl} is not allowing requests from this origin. Please configure CORS on your backend server.`);
					return;
				}

				// Check for connection refused
				if (errorMessage.includes('Failed to fetch') ||
					errorMessage.includes('NetworkError') ||
					errorMessage.includes('Network request failed') ||
					errorMessage.includes('ERR_CONNECTION_REFUSED') ||
					errorMessage.includes('ERR_NAME_NOT_RESOLVED')) {
					console.error('Connection Failed!');
					sweetErrorAlert(`Cannot connect to server at ${graphqlUrl}.\n\nPossible causes:\n1. Backend server is not running\n2. Wrong URL/port\n3. Firewall blocking the connection\n\nPlease check if your backend is running on port 3007.`);
					return;
				}

				if (errorMessage.includes('Socket') || errorMessage.includes('socket')) {
					console.warn('Socket error suppressed:', errorMessage);
					return;
				}


				if (statusCode === 401) {
					// Handle unauthorized error - don't show alert, let the component handle it
					console.warn('Unauthorized request');
				} else if (statusCode === 404) {
					sweetErrorAlert(`GraphQL endpoint not found at ${graphqlUrl}. Please check if the endpoint path is correct.`);
				} else if (statusCode === 500) {
					sweetErrorAlert('Server error (500). Please check your backend server logs.');
				} else if (statusCode) {
					sweetErrorAlert(`HTTP Error ${statusCode}: ${errorMessage || 'Please check your connection'}`);
				} else {
					sweetErrorAlert(`Network error: ${errorMessage || 'Please check your connection and ensure the backend server is running'}`);
				}
			}
		});

		const splitLink = split(
			({ query }) => {
				const definition = getMainDefinition(query);
				return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
			},
			wsLink,
			authLink.concat(httpLink),
		);

		return from([errorLink, tokenRefreshLink, splitLink]);
	}

	// Server-side: return HTTP link only
	return from([authLink, httpLink]);
}

function createApolloClient() {
	const link = createIsomorphicLink();

	if (!link) {
		console.error('Apollo Client link is not initialized!');
	}

	return new ApolloClient({
		ssrMode: typeof window === 'undefined',
		link: link,
		cache: new InMemoryCache({
			typePolicies: {
				Query: {
					fields: {
						// Add any field policies if needed
					},
				},
			},
		}),
		defaultOptions: {
			watchQuery: {
				fetchPolicy: 'cache-and-network',
				errorPolicy: 'all',
			},
			query: {
				fetchPolicy: 'network-only',
				errorPolicy: 'all',
			},
			mutate: {
				errorPolicy: 'all',
			},
		},
	});
}

export function initializeApollo(initialState: NormalizedCacheObject | null = null) {
	const _apolloClient = apolloClient ?? createApolloClient();
	if (initialState) {
		_apolloClient.cache.restore(initialState);
	}
	if (typeof window === 'undefined') return _apolloClient;
	if (!apolloClient) apolloClient = _apolloClient;

	return _apolloClient;
}

export function useApollo(initialState: NormalizedCacheObject | null = null) {
	return useMemo(() => initializeApollo(initialState), [initialState]);
}
