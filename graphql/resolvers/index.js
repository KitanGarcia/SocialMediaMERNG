const postsResolvers = require("./posts");
const usersResolvers = require("./users");

//for queries, mutations, etc. to work, they need to be included here

module.exports = {
  Query: {
    ...postsResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation
  }
}
