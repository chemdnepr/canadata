import { ApolloClient, InMemoryCache, DefaultOptions } from "@apollo/client";

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}

const apolloClient = new ApolloClient({
  uri: `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/api/graphql`,
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

export default apolloClient;
