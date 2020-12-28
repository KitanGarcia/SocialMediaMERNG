import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

function Register() {
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const onChange = (event) => {
    setValues({...values, [event.target.name]: event.target.value});
  }

  //update is triggered if mutation is successfully executed
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(proxy, result) {
      console.log(result);
    },
    //graphQLErrors gives one error with an object that contains the other errors
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.exception.errors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });

  const onSubmit = (event) => {
    event.preventDefault();
    addUser();
  };


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
          onChange={onChange}
        />

        <Form.Input
          label="Email"
          placeholder="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={onChange}
        />

        <Form.Input
          label="Password"
          placeholder="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={onChange}
        />

        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
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
