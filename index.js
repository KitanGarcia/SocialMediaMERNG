const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag"); //installed with ApolloServer as dependency
const mongoose = require("mongoose");

const Post = require("./models/Post");
const { MONGODB } = require("./config.js");

//graphql types. tag template string
const typeDefs = gql`
  type Post {
    id: ID!,
    body: String!,
    username: String!,
    createdAt: String!
  }
  type Query {
    getPosts: [Post]
  }
`;

//resolvers for each query, mutation, or subscription to process logic
//all queries go in Query object, mutations in Mutation object, etc.
const resolvers = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find(); //fetch all posts
        return posts;
      }
      catch (err) {
        throw new Error(err);
      }
    }
  }
}

//Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

//connect to DB before launching server
mongoose.connect(MONGODB, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB");
    return server.listen({ port: 5000 });
  })
  .then(res => {
    console.log(`Server running at ${res.url}`); //going to this url navigates to graphql playground
  });
