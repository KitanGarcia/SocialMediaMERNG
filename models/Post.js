const {model, Schema } = require("mongoose");

//required fields will be handled on graphql layer, not here with mongoose
const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  comments: [
    {
      body: String,
      username: String,
      createdAt: String
    }
  ],
  likes: [
    {
      username: String,
      createdAt: String
    }
  ],
  //allows us to use mongoose to automatically populate user fields. Links data models
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  }
});

module.exports = model("Post", postSchema);
