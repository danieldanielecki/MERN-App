import { GET_POSTS, POST_ERROR } from "../actions/types";

// Initial state data.
const initialState = {
  posts: [], // Object for posts listing page.
  post: null, // Object which once user will be logged it will be filled with post's data what will be returned from HTTP request. It will be filled with data also when post page of a different user will be visited with data of that visited user's page.
  loading: true, // Before any request will be performed set "loading" to "true". Once we make (finish) a request it will be set to "false".
  error: {}, // Object for any errors in the request.
};

// Every reducer takes "state" by default being the "initialState" and an "action".
export default function (state = initialState, action) {
  const { type, payload } = action; // Pull out these valeus from the action, so every time we access the property we don't have to do "action.type" etc., instead simply "type" etc.

  switch (type) {
    case GET_POSTS:
      // State is immutable, therefore when adding another one it'll be an array. That's why we need to use spread operator to return all of them. On top of this, return "posts" array (fill the empty array with posts from the server) which is taken from the response's "payload" as well as set "loading" to "false" once the request is done.
      return {
        ...state,
        posts: payload,
        loading: false,
      };
    case POST_ERROR:
      // State is immutable, therefore when adding another one it'll be an array. That's why we need to use spread operator to return all of them. On top of this, return "error" which is taken from the response's "payload" as well as set "loading" to "false" once the request is done.
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state; // Every reducer we create will have a default case with returning a state.
  }
}
