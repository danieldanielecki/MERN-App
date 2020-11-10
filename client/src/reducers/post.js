import {
  ADD_POST,
  DELETE_POST,
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
} from "../actions/types";

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
    case ADD_POST:
      // State is immutable, therefore when adding another one it'll be an array. That's why we need to use spread operator to return all of them. On top of this, return "posts" (explained below in detail) as well as set "loading" to "false" once the request is done.
      return {
        ...state,
        posts: [payload, ...state.posts], // Make a copy of posts and add a new post, which is in the "payload". Set up "payload" first, so the posts are shown from the newest one to the oldest once they have been added. The same is when getting them from the server, i.e. refreshing browser.
        loading: false,
      };
    case DELETE_POST:
      // State is immutable, therefore when adding another one it'll be an array. That's why we need to use spread operator to return all of them. On top of this, return "posts" (explained below in detail) as well as set "loading" to "false" once the request is done.
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== payload), // Return all posts except that one which matches here, because that's the one we want to delete. "payload" is in this case simply "id" of the post as it was defined in post.js Actions ("deletePost" method).
        loading: false,
      };
    case POST_ERROR:
      // State is immutable, therefore when adding another one it'll be an array. That's why we need to use spread operator to return all of them. On top of this, return "error" which is taken from the response's "payload" as well as set "loading" to "false" once the request is done.
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case UPDATE_LIKES:
      // State is immutable, therefore when adding another one it'll be an array. That's why we need to use spread operator to return all of them. On top of this, return "posts" (explained below in detail) as well as set "loading" to "false" once the request is done.
      return {
        ...state,
        // Map through posts and check if that's the correct one to update (if ID's matches). If that's the correct one then return a new state with all what's in the post ("...post") and we want to manipulate just the likes to that likes which are returned. If it doesn't match the ID then simply return the post and don't do anything with it.
        posts: state.posts.map((post) =>
          post._id === payload.id ? { ...post, likes: payload.likes } : post
        ),
        loading: false,
      };
    default:
      return state; // Every reducer we create will have a default case with returning a state.
  }
}
