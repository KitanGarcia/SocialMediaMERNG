import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import { AuthContext } from "../context/auth";

//redirect to home if login or register attempted while already logged in
//takes in props with component with alias of Component so we can use it as a component
function AuthRoute({ component: Component, ...rest }) {
  const { user } = useContext(AuthContext); //destructure user from AuthContext 

  return (
    <Route
      {...rest}
      render={props =>
        user ? <Redirect to="/"/> : <Component {...props}/> /*if user exists (logged in), redirect to home*/
      }
    />
  );
}

export default AuthRoute;
