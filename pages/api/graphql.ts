import { ApolloServer } from 'apollo-server-micro';
import { schema } from '../../graphql/schema';
import { resolvers } from '../../graphql/resolvers';
import { createContext } from '../../graphql/context';
import Cors from 'micro-cors';

const cors = Cors();
const apolloServer = new ApolloServer({ schema, resolvers, context: createContext });

const startServer = apolloServer.start();


export default cors(async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  await startServer;
  const handler = apolloServer.createHandler({    
    path: '/api/graphql'
  });
  await Cors((req, res) =>handler(req, res));
});

export const config = {
  api: {
    bodyParser: false
  }
};
