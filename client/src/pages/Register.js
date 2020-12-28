import React, { useContext, useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

function Register(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  //using hooks to implement onChange and onSubmit
  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  //needs to be done and passed as callback above because hoisting allows it to work and not addUser
  //functions with function keyword are hoisted, but not other functions so they are recognized before definition
  //hacky workaround
  function registerUser() {
    addUser();
  }

  //update is triggered if mutation is successfully executed
  const [addUser, { loading }] = useMutation(REGISTER_USER, {

    //update result.data.register with alias as userData
    update(_, { data: { register: userData}}) {
      context.login(userData); //when we register, we should also login
      props.history.push("/"); //redirect to homepage after registering
    },

    //graphQLErrors gives one error with an object that contains the other errors
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.exception.errors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });

  return (
    <div className="form-container">
      {/*if loading is true, set className to loading. Otherwise, keep it empty*/}
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Register</h1>
        <Form.Input
          label="Username"
          placeholder="Username"
          name="username"
          type="text"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />

        <Form.Input
          label="Email"
          placeholder="Email"
          name="email"
          type="email"
          value={values.email}
          error={errors.email ? true : false}
          onChange={onChange}
        />

        <Form.Input
          label="Password"
          placeholder="Password"
          name="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />

        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={onChange}
        />
      
        <Button type="submit" primary>
          Register
        </Button>
      </Form>

      {/*logic to show errors from graphql*/}
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map(value => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

//GraphQL query
//triggers register mutation taking in registerInput (from server code) with fields as variables
//get back the id, email, username, createdAt, and the token
const REGISTER_USER = gql `
  mutation register(
    $username: String!,
    $email: String!,
    $password: String!,
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username,
        email: $email,
        password: $password,
        confirmPassword: $confirmPassword
      }
    ) {
      id,
      email,
      username,
      createdAt,
      token
    }
  }
`;

export default Register;
