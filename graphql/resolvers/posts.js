const { AuthenticationError } = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require("../../util/check_auth.js");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 }); //fetch all posts and sort in descending order
        return posts;
      }
      catch (err) {
        throw new Error(err);
      }
    },
    //underscore takes in parent as parameter
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        }
        else {
          throw new Error("Post not found");
        }
      }
      catch (err) {
        throw new Error(err);
      }
    }
  },
  /*
   * to create a post, get token by logging in. IE. username: sad, password: asd
   *  mutation{
   *    login(username:"sad", password:"asd"){
   *      id
   *      username
   *      token
   *    }
   *  }
   * Then, enter token from response into "Authorization" HTTP Header as "Bearer <token>" when using the createPost mutation
   *
   * Now, we can see this new post with 
   *  query{
   *    getPosts {
   *      id,
   *      body,
   *      username,
   *      createdAt
   *    }
   *  }
   */
  Mutation: {
    async createPost(_, { body }, context) { //context will contain request body as stated in index.js
      const user = checkAuth(context);
      console.log(user);

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();

      return post;
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);
      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return "Post deleted successfulyl";
        }
        else {
          throw new AuthenticationError("Action not allowed");
        }
      }
      catch(err) {
        throw new Error(err);
      }
    }
  }
};
