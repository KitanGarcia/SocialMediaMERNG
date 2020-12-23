const { AuthenticationError, UserInputError } = require("apollo-server");

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

      if (args.body.trim() === "") {
        throw new Error("Post body must not be empty");
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();

      context.pubsub.publish("NEW_POST", {
        newPost: post
      });

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
    },
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);
      
      const post = await Post.findById(postId);
      if (post) {
        //find a like where the like username is the same as the current. If like exists, unlike it
        if (post.likes.find(like => like.username === username)) {
          post.likes = post.likes.filter(like => like.username !== username); //only remove the like given by current user
        }
        //Not liked; like the post
        else {
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          });
        }
        await post.save();
        return post;
      }
      else {
        throw new UserInputError("Post not found");
      }
    }
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_POST") //no arguments, so use __
    }
  }
};
