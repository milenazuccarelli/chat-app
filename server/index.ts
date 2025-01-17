import { ApolloServer, PubSub } from "apollo-server-express";
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import schema from "./schema";

// importing http protocol that will be used in order to install subscription handlers
import http from "http";

// importing users from mock db to mock a logged in user with id 1 # line 19 & adding user with user ID 1 to context so it can be read by resolvers
import { users } from "./db";

const app = express();
app.use(cors());

app.use(bodyParser.json());

// creating pubsub event listener
const pubsub = new PubSub();

// applying event listener and current "logged in" user to the context of apollo server
const server = new ApolloServer({
  schema,
  context: () => ({
    currentUser: users.find(u => u.id === "1"),
    pubsub
  })
});

server.applyMiddleware({
  app,
  path: "/graphql"
});

// once middleware was applied to the apollo server ( app and graphql ) applying http server for express app
const httpServer = http.createServer(app);

// installing subscription handlers on httpServer
server.installSubscriptionHandlers(httpServer);

const port = process.env.PORT || 4000;

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
