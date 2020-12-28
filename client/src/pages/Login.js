import React, { useContext, useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks"

function Login(props) {
  const context = useContext(AuthContext); //has user, login, and logout
  const [errors, setErrors] = useState({});

  //using hooks to implement onChange and onSubmit
  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });

  //needs to be done and passed as callback above because hoisting allows it to work and not addUser
  //functions with function keyword are hoisted, but not other functions so they are recognized before definition
  //hacky workaround
  function loginUserCallback() {
    loginUser();
  }

  //update is triggered if mutation is successfully executed
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {

    //update with result.data.login.userData
    update(_, { data: {login: userData}}) {
      context.login(userData);
      props.history.push("/"); //redirect to homepage after registering
    },
    //graphQLErrors gives one error with an object that contains the other errors
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });

  return (
    <div className="form-container">
      {/*if loading is true, set className to loading. Otherwise, keep it empty*/}
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
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
          label="Password"
          placeholder="Password"
          name="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />
      
        <Button type="submit" primary>
          Login
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
//triggers login mutation taking in username and password
//get back the id, email, username, createdAt, and the token
const LOGIN_USER = gql `
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id,
      email,
      username,
      createdAt,
      token
    }
  }
`;

export default Login;
