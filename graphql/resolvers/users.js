const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { validateRegisterInput, validateLoginInput } = require("../../util/validators");
const {SECRET_KEY } = require("../../config");
const User = require("../../models/User");


function generateToken(user) {
return jwt.sign(
  {
    id: user.id,
    email: user.email,
    username: user.username
  },
  SECRET_KEY,
  {expiresIn: "1h"}
  );
}


module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const {errors, valid} = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }



      const user = await User.findOne({ username });
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }
      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      }
    },
    //parent gives result of input from last step
    //args is the register arguments from typeDefs.js. Args is destructured to registerInput here
    //info has general info on metadata
    //
    /*
     *mutation{
     *  register(registerInput:{
     *    username:"123"
     *    password:"123"
     *    confirmPassword:"123"
     *    email:"123123@gmail.com"
     *  })
     *  {  
     *    id
     *    email
     *    token
     *    username
     *    createdAt
     *  }
     *}
     */
    async register(
      _,
      {
        registerInput: {username, email, password, confirmPassword}
      },
      context,
      info
    ) {
      //validate user data
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      //throwing error from apollo is user already exists (to prevent multiple sign ups as same user)
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: "This username is taken"
          }
        });
      }

      //hash password and create auth token
      password = await bcrypt.hash(password, 12);
      const newUser = new User ({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      });
      const res = await newUser.save();
      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      }
    }
  }
}
