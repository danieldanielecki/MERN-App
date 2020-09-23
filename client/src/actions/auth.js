import axios from "axios";
import setAuthToken from "./../utils/setAuthToken";
import { setAlert } from "./alert";
import {
  AUTH_ERROR,
  CLEAR_PROFILE,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED,
} from "./types";

// Load User.
// Dispatch more than 1 action type from this function. We're able to do it because of the "thunk" middleware, the crucial point is "()" (which is allowed by the "thunk" middleware and it wraps an expression to delay its evaluation) then "=>", "async (dispatch)" and "=>" again to do so.
export const loadUser = () => async (dispatch) => {
  // Check if there is a token and if it is then put this into a global header. Here it'll check only for the first time when the user loads.
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  // Token is there, then make a request.
  try {
    const res = await axios.get("/api/auth"); // Make request to "/api/auth" backend route.

    dispatch({
      type: USER_LOADED, // If request was successful, dispatch "USER_LOADED".
      payload: res.data, // Payload will be the user's data.
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR, // If request was not successful, dispatch "AUTH_ERROR".
    });
  }
};

// Register User action.
// Dispatch more than 1 action type from this function. We're able to do it because of the "thunk" middleware, the crucial point is "({ name, email, password })" (which is allowed by the "thunk" middleware and it wraps an expression to delay its evaluation) then "=>", "async (dispatch)" and "=>" again to do so.
export const register = ({ name, email, password }) => async (dispatch) => {
  // Create config object with HTTP headers.
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ name, email, password }); // Prepare the data to send.

  try {
    const res = await axios.post("/api/users", body, config); // Get HTTP's POST response.

    // Dispatch an action when registration has been successful.
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data, // In this case the data we're getting back is a token.
    });

    dispatch(loadUser()); // Dispatch "loadUser" action.
  } catch (err) {
    const errors = err.response.data.errors; // Get an array of errors from the backend.

    // Check if response from backend returned errors.
    if (errors) {
      // Loop through the errors and for each of the errors dispatch "setAlert" action.
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    // Dispatch an action when registration fails.
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User action.
// Dispatch more than 1 action type from this function. We're able to do it because of the "thunk" middleware, the crucial point is "(email, password)" (which is allowed by the "thunk" middleware and it wraps an expression to delay its evaluation) then "=>", "async (dispatch)" and "=>" again to do so.
export const login = (email, password) => async (dispatch) => {
  // Create config object with HTTP headers.
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password }); // Prepare the data to send.

  try {
    // Using JSON Web Token (JWT) is a stateless (which means the data doesn't stay, we need to keep making a request to the backend) form of authentication. So actually we have to keep querying the server and see if the token on frontend matches that one on the backend. It'll be done in an action "api/auth" route.
    const res = await axios.post("/api/auth", body, config); // Get HTTP's POST response.

    // Dispatch an action when login has been successful.
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data, // In this case the data we're getting back is a token.
    });

    dispatch(loadUser()); // Dispatch "loadUser" action.
  } catch (err) {
    const errors = err.response.data.errors; // Get an array of errors from the backend.

    // Check if response from backend returned errors.
    if (errors) {
      // Loop through the errors and for each of the errors dispatch "setAlert" action.
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    // Dispatch an action when login fails.
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Clear Profile / Logout actions.
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};
