const {model, Schema } = require("mongoose");

//required fields will be handled on graphql layer, not here with mongoose
const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String
});

module.exports = model("User", userSchema);
