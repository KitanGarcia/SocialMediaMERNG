const { gql } = require("apollo-server");

//graphql types. tag template string
module.exports = gql`
  type Post {
    id: ID!,
    body: String!,
    username: String!,
    createdAt: String!
  }
  type User {
    id: ID!,
    email: String!,
    token: String!,
    username: String!,
    createdAt: String!,
  }
  input RegisterInput {
    username: String!,
    password: String!,
    confirmPassword: String!,
    email: String!
  }
  type Query {
    getPosts: [Post]
  }
  type Mutation {
    register(registerInput: RegisterInput): User!,
    login(username: String!, password: String!): User!
  }
`;

//login(username: String!, password: String!): User!
//login takes in a username and password both of which are strings and returns a user
