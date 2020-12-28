import React, { useReducer, createContext } from "react";
import jwtDecode from "jwt-decode";

const initialState = {
  user: null
};

//check if there is a token. Decode and check expiration
if (localStorage.getItem("jwtToken")) {
  const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));

  //token expiration (in ms) is expired
  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("jwtToken");
  }
  //set user to decoded token if not expired
  else {
    initialState.user = decodedToken;
  }
}

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {}
});

//reducer receives an action with a type and payload and determines what to do depending
function authReducer(state, action) {
  switch(action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload
      }
    case "LOGOUT":
      return {
        ...state,
        user: null
      }
    default:
      return state;
  }
}

function AuthProvider(props) {
  //useReducer takes a reducer and returns a state and dispatch
  const [state, dispatch] = useReducer(authReducer, initialState); //user: null is our initial state

  //Once we have dispatch, we can dispatch any action and attach a type and payload to it
  //When it is dispatched, the reducer listens and reacts accordingly

  //call on login to change data in context, setting user to correct details so app knows we're logged in
  function login(userData) {
    localStorage.setItem("jwtToken", userData.token); //store token locally so users stay logged in on refresh
    dispatch({
      type: "LOGIN",
      payload: userData
    });
  }

  function logout() {
    localStorage.removeItem("jwtToken");
    dispatch({type: "LOGOUT"});
  }

  //return AuthProvider so it can be used elsewhere
  return (
    <AuthContext.Provider
      /*value is passed to components underneath this context provider*/
      value={{ user: state.user, login, logout}}
      {...props}
    />
  )
}

export { AuthContext, AuthProvider };
