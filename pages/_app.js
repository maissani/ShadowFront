import React from 'react'
import Head from 'next/head'
import { Provider } from 'react-redux'
import App, { Container } from 'next/app'
import withRedux from 'next-redux-wrapper'
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloLink, split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from "subscriptions-transport-ws";
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ws from 'ws';

import initStore from '../utils/store'

const httpLink = new HttpLink({
	uri: 'http://localhost:8000/graphql',
  });
  
  const wsLink = process.browser ? new WebSocketLink({
	uri: `ws://localhost:8000/graphql`,
	options: {
	  reconnect: true,
	}, 
	ws
  }) : null;
  
  const terminatingLink = process.browser ? split(
	({ query }) => {
	  const { kind, operation } = getMainDefinition(query);
	  return (
		kind === 'OperationDefinition' && operation === 'subscription'
	  );
	},
	wsLink,
	httpLink,
  ) : httpLink;
  
  const authLink = new ApolloLink((operation, forward) => {
	operation.setContext(
	  ({
		headers = {},
		localToken = localStorage.getItem('token'),
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

/* debug to log how the store is being used */
export default withRedux(initStore, {
	debug: typeof window !== 'undefined' && process.env.NODE_ENV !== 'production'
})(
	class MyApp extends App {


		static async getInitialProps({ Component, ctx }) {
			return {
				pageProps: {
					// Call page-level getInitialProps
					...(Component.getInitialProps
						? await Component.getInitialProps(ctx)
						: {})
				}
			}
		}

		render() {
			const { Component, pageProps, store } = this.props
			return (
				<ApolloProvider client={client}>
					<Container>
						<Head>
							<title>shadowFront</title>
						</Head>
						<Provider store={store}>
							<Component {...pageProps} />
						</Provider>
					</Container>
				</ApolloProvider>
			)
		}
	}
)
