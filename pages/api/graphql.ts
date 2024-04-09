import { ApolloServer } from 'apollo-server-micro';
import { schema } from '../../graphql/schema';
import { resolvers } from '../../graphql/resolvers';
import { createContext } from '../../graphql/context';
import micro_cors from 'micro-cors';

const cors = micro_cors({
  origin: "https://canadark.com",
  allowCredentials: true,
  allowMethods:["GET", "POST","PUT","DELETE"],
  allowHeaders:["access-control-allow-credentials","access-control-allow-origin","content-type"]          
  });
const apolloServer = new ApolloServer({ schema, resolvers, context: createContext });

const startServer = apolloServer.start();


export default cors(async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  await startServer;
  await apolloServer.createHandler({    
    path: '/api/graphql'
  })(req, res);
});

export const config = {
  api: {
    bodyParser: false
  }
};