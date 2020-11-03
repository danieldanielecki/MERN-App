import axios from "axios";
import { setAlert } from "./alert";
import { DELETE_POST, GET_POSTS, POST_ERROR, UPDATE_LIKES } from "./types";

// Get posts.
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/posts"); // Make request to "/api/posts" backend route. We don't have to pass an ID or anything, because it'll know which post to load from the token we sent which has the user ID.

    dispatch({
      type: GET_POSTS, // If request was successful, dispatch "GET_POSTS".
      payload: res.data, // Payload will be the user's data.
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR, // If request was not successful, dispatch "POST_ERROR".
      msg: { msg: err.response.statusText, status: err.response.status }, // Get the message text and status code from the response.
    });
  }
};

// Add like.
// We need to know which post we're adding a like to that's why we need "id", which is the post's ID.
export const addLike = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/like/${id}`); // Get HTTP's PUT response. We don't have to pass an ID or anything, because it'll know which post to load from the token we sent which has the user ID.

    dispatch({
      type: UPDATE_LIKES, // If request was successful, dispatch "UPDATE_LIKES".
      payload: { id, likes: res.data }, // Payload will be the user's data and post's ID.
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR, // If request was not successful, dispatch "POST_ERROR".
      msg: { msg: err.response.statusText, status: err.response.status }, // Get the message text and status code from the response.
    });
  }
};

// Remove like.
// We need to know which post we're removing a like from that's why we need "id", which is the post's ID.
export const removeLike = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/unlike/${id}`); // Get HTTP's PUT response. We don't have to pass an ID or anything, because it'll know which post to load from the token we sent which has the user ID.

    dispatch({
      type: UPDATE_LIKES, // If request was successful, dispatch "UPDATE_LIKES".
      payload: { id, likes: res.data }, // Payload will be the user's data and post's ID.
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR, // If request was not successful, dispatch "POST_ERROR".
      msg: { msg: err.response.statusText, status: err.response.status }, // Get the message text and status code from the response.
    });
  }
};

// Delete post.
// We need to know which post we're removing from that's why we need "id", which is the post's ID.
export const deletePost = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/posts/${id}`); // Get HTTP's DELETE response. We don't have to pass an ID or anything, because it'll know which post to load from the token we sent which has the user ID.

    dispatch({
      type: DELETE_POST, // If request was successful, dispatch "DELETE_POST".
      payload: id, // Payload will be the post's ID.
    });

    dispatch(setAlert("Post Removed", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR, // If request was not successful, dispatch "POST_ERROR".
      msg: { msg: err.response.statusText, status: err.response.status }, // Get the message text and status code from the response.
    });
  }
};
