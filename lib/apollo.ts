import { ApolloClient, InMemoryCache, DefaultOptions, createHttpLink } from "@apollo/client";

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

const link = createHttpLink({
  uri: `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/api/graphql`,
  credentials: 'same-origin'
});
const apolloClient = new ApolloClient({  
  cache: new InMemoryCache(),
  link,
  defaultOptions: defaultOptions,
});

export default apolloClient;
