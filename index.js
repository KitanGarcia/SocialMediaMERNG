const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag"); //installed with ApolloServer as dependency
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");

//resolvers for each query, mutation, or subscription to process logic
//all queries go in Query object, mutations in Mutation object, etc.
const resolvers = require("./graphql/resolvers"); //since it's in index, no need to specify
const { MONGODB } = require("./config.js");



//Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

//connect to DB before launching server
mongoose
  .connect(MONGODB, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB");
    return server.listen({ port: 5000 });
  })
  .then(res => {
    console.log(`Server running at ${res.url}`); //going to this url navigates to graphql playground
  });
