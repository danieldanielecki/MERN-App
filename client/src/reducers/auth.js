import {
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED,
} from "../actions/types";

// Initial state data.
const initialState = {
  token: localStorage.getItem("token"), // Fetch token.
  isAuthenticated: null, // Before any request will be performed set "isAuthenticated" to "null". After successful authentication this will be set to "true" and the user will see dashboard, navbar etc. (whatever should be displayed after successful authentication).
  loading: true, // Before any request will be performed set "loading" to "true". Once we make (finish) a request it will be set to "false".
  user: null, // Before any request will be performed set "user" to "null". After making a request to "api/auth" and we get the user data it will added here.
};

// Every reducer takes "state" by default being the "initialState" and an "action".
export default function (state = initialState, action) {
  const { type, payload } = action; // Pull out these valeus from the action, so every time we access the property we don't have to do "action.type" etc.

  switch (type) {
    case USER_LOADED:
      // State is immutable, therefore when adding another one it'll be an array. That's why we need to use spread operator to return all of them. On top of this, return an appropriate booleans and set "user" to "payload" for a case when user has been loaded.
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload, // Set "user" to the "payload", which includes all user data such as name, email, avatar etc. excluding password, because in the backend ".select('-password')" makes it to exclude password.
      };
    // These cases have exactly the same logic, therefore it can be used with simplified "case" statement.
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem("token", payload.token); // Set token.

      // State is immutable, therefore when adding another one it'll be an array. That's why we need to use spread operator to return all of them. On top of this, return a payload and appropriate booleans for a case when user has been registered successfuly.
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    // These cases have exactly the same logic, therefore it can be used with simplified "case" statement.
    case LOGIN_FAIL:
    case LOGOUT:
    case REGISTER_FAIL:
    case AUTH_ERROR:
      localStorage.removeItem("token"); // If the registration failed or authentication error occured then remove the token completely from localStorage.
      // State is immutable, therefore when adding another one it'll be an array. That's why we need to use spread operator to return all of them. On top of this, set "token" to "null" and return an appropriate booleans for a case when user's registered has failed or authentication error occured.
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state; // Every reducer we create will have a default case with returning a state.
  }
}
