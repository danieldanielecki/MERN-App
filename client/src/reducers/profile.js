import {
  CLEAR_PROFILE,
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
} from "../actions/types";

// Initial state data.
const initialState = {
  profile: null, // Object which once user will be logged it will be filled with profile's data what will be returned from HTTP request. It will be filled with data also when profile page of a different user will be visited with data of that visited user's page.
  profiles: [], // Object for profile listing page.
  repos: [], // GitHub repositories.
  loading: true, // Before any request will be performed set "loading" to "true". Once we make (finish) a request it will be set to "false".
  error: {}, // Object for any errors in the request.
};

// Every reducer takes "state" by default being the "initialState" and an "action".
export default function (state = initialState, action) {
  const { type, payload } = action; // Pull out these valeus from the action, so every time we access the property we don't have to do "action.type" etc.

  switch (type) {
    // These cases have exactly the same logic, therefore it can be used with simplified "case" statement.
    case GET_PROFILE:
    case UPDATE_PROFILE:
      // State is immutable, therefore when adding another one it'll be an array. That's why we need to use spread operator to return all of them. On top of this, return "profile" which is taken from the response's payload as well as set "loading" to "false" once the request is done.
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case PROFILE_ERROR:
      // State is immutable, therefore when adding another one it'll be an array. That's why we need to use spread operator to return all of them. On top of this, return "error" which is taken from the response's payload as well as set "loading" to "false" once the request is done.
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case CLEAR_PROFILE:
      // State is immutable, therefore when adding another one it'll be an array. That's why we need to use spread operator to return all of them. On top of this, to fully clear profile, set "profile" to "null", repost to empty array and "loading" to "false".
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false,
      };
    default:
      return state; // Every reducer we create will have a default case with returning a state.
  }
}
