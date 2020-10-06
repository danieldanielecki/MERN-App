import axios from "axios";
import { setAlert } from "./alert";
import {
  ACCOUNT_DELETED,
  CLEAR_PROFILE,
  GET_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  PROFILE_ERROR,
  UPDATE_PROFILE,
} from "./types";

// Get current user's profile.
// Dispatch more than 1 action type from this function. We're able to do it because of the "thunk" middleware, the crucial point is "()" (which is allowed by the "thunk" middleware and it wraps an expression to delay its evaluation) then "=>", "async (dispatch)" and "=>" again to do so.
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/profile/me"); // Make request to "/api/profile/me" backend route. We don't have to pass an ID or anything, because it'll know which profile to load from the token we sent which has the user ID.

    dispatch({
      type: GET_PROFILE, // If request was successful, dispatch "GET_PROFILE".
      payload: res.data, // Payload will be the user's data.
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR, // If request was not successful, dispatch "PROFILE_ERROR".
      msg: { msg: err.response.statusText, status: err.response.status }, // Get the message text and status code from the response.
    });
  }
};

// Get all profiles.
// Dispatch more than 1 action type from this function. We're able to do it because of the "thunk" middleware, the crucial point is "()" (which is allowed by the "thunk" middleware and it wraps an expression to delay its evaluation) then "=>", "async (dispatch)" and "=>" again to do so.
export const getProfiles = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE }); // When user goes to profiles list page lets clear whatever is in the current profile, because when we visit a single user profile it's gonna to the state, so dispatch "CLEAR_PROFILE". It might prevent flashing of past user's profile, not sure if that's essentially needed.

  try {
    const res = await axios.get("/api/profile"); // Make request to "/api/profile" backend route. We don't have to pass an ID or anything, because it'll know which profile to load from the token we sent which has the user ID.

    dispatch({
      type: GET_PROFILES, // If request was successful, dispatch "GET_PROFILES".
      payload: res.data, // Payload will be the user's data.
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR, // If request was not successful, dispatch "PROFILE_ERROR".
      msg: { msg: err.response.statusText, status: err.response.status }, // Get the message text and status code from the response.
    });
  }
};

// Get aprofile by ID.
// Dispatch more than 1 action type from this function. We're able to do it because of the "thunk" middleware, the crucial point is "(userId)" (which is allowed by the "thunk" middleware and it wraps an expression to delay its evaluation) then "=>", "async (dispatch)" and "=>" again to do so. Get profile ID based on user ID (those 2 are different).
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`); // Make request to "/api/profile/user/${userId}" backend route. We don't have to pass an ID or anything, because it'll know which profile to load from the token we sent which has the user ID.

    dispatch({
      type: GET_PROFILE, // If request was successful, dispatch "GET_PROFILE".
      payload: res.data, // Payload will be the user's data.
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR, // If request was not successful, dispatch "PROFILE_ERROR".
      msg: { msg: err.response.statusText, status: err.response.status }, // Get the message text and status code from the response.
    });
  }
};

// Get GitHub repos.
// Dispatch more than 1 action type from this function. We're able to do it because of the "thunk" middleware, the crucial point is "(username)" (which is allowed by the "thunk" middleware and it wraps an expression to delay its evaluation) then "=>", "async (dispatch)" and "=>" again to do so. Get GitHub repos based on GitHub's username.
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/github/${username}`); // Make request to "/api/profile/github/${username}" backend route. We don't have to pass an ID or anything, because it'll know which profile to load from the token we sent which has the user ID.

    dispatch({
      type: GET_REPOS, // If request was successful, dispatch "GET_REPOS".
      payload: res.data, // Payload will be the user's data.
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR, // If request was not successful, dispatch "PROFILE_ERROR".
      msg: { msg: err.response.statusText, status: err.response.status }, // Get the message text and status code from the response.
    });
  }
};

// Create or update profile.
// Dispatch more than 1 action type from this function. We're able to do it because of the "thunk" middleware, the crucial point is "(formData, history, edit = false)" (which is allowed by the "thunk" middleware and it wraps an expression to delay its evaluation) then "=>", "async (dispatch)" and "=>" again to do so. "formData" will have some data. "history" has method called "push" which will redirect us to client side routes. "edit" is for letting know if we're updating/editing or creating a new profile.
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    // We're sending data, so we'll need to create config object.
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.post("/api/profile", formData, config); // Get HTTP's POST response.

    dispatch({
      type: GET_PROFILE, // If request was successful, dispatch "GET_PROFILE".
      payload: res.data, // Payload will be the user's data.
    });

    dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success")); // Message should be different depending if the profile is updated or created.

    // Redirect user if profile has been created.
    if (!edit) {
      history.push("/dashboard"); // Redirection in action is different, simply "<Redirect..." doesn't work here.
    }
  } catch (err) {
    const errors = err.response.data.errors; // Get an array of errors from the backend.

    // Check if response from backend returned errors.
    if (errors) {
      // Loop through the errors and for each of the errors dispatch "setAlert" action.
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR, // If request was not successful, dispatch "PROFILE_ERROR".
      msg: { msg: err.response.statusText, status: err.response.status }, // Get the message text and status code from the response.
    });
  }
};

// Add Experience.
// Dispatch more than 1 action type from this function. We're able to do it because of the "thunk" middleware, the crucial point is "(formData, history)" (which is allowed by the "thunk" middleware and it wraps an expression to delay its evaluation) then "=>", "async (dispatch)" and "=>" again to do so.
export const addExperience = (formData, history) => async (dispatch) => {
  try {
    // We're sending data, so we'll need to create config object.
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.put("/api/profile/experience", formData, config); // Get HTTP's PUT response.

    dispatch({
      type: UPDATE_PROFILE, // If request was successful, dispatch "UPDATE_PROFILE".
      payload: res.data, // Payload will be the user's data.
    });

    dispatch(setAlert("Experience Added", "success")); // Dispatch "setAlert" action.

    history.push("/dashboard"); // Redirection in action is different, simply "<Redirect..." doesn't work here.
  } catch (err) {
    const errors = err.response.data.errors; // Get an array of errors from the backend.

    // Check if response from backend returned errors.
    if (errors) {
      // Loop through the errors and for each of the errors dispatch "setAlert" action.
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR, // If request was not successful, dispatch "PROFILE_ERROR".
      msg: { msg: err.response.statusText, status: err.response.status }, // Get the message text and status code from the response.
    });
  }
};

// Add Education.
// Dispatch more than 1 action type from this function. We're able to do it because of the "thunk" middleware, the crucial point is "(formData, history)" (which is allowed by the "thunk" middleware and it wraps an expression to delay its evaluation) then "=>", "async (dispatch)" and "=>" again to do so.
export const addEducation = (formData, history) => async (dispatch) => {
  try {
    // We're sending data, so we'll need to create config object.
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.put("/api/profile/education", formData, config); // Get HTTP's PUT response.

    dispatch({
      type: UPDATE_PROFILE, // If request was successful, dispatch "UPDATE_PROFILE".
      payload: res.data, // Payload will be the user's data.
    });

    dispatch(setAlert("Education Added", "success")); // Dispatch "setAlert" action.

    history.push("/dashboard"); // Redirection in action is different, simply "<Redirect..." doesn't work here.
  } catch (err) {
    const errors = err.response.data.errors; // Get an array of errors from the backend.

    // Check if response from backend returned errors.
    if (errors) {
      // Loop through the errors and for each of the errors dispatch "setAlert" action.
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR, // If request was not successful, dispatch "PROFILE_ERROR".
      msg: { msg: err.response.statusText, status: err.response.status }, // Get the message text and status code from the response.
    });
  }
};

// Delete Experience.
// Dispatch more than 1 action type from this function. We're able to do it because of the "thunk" middleware, the crucial point is "(id)" (which is allowed by the "thunk" middleware and it wraps an expression to delay its evaluation) then "=>", "async (dispatch)" and "=>" again to do so.
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`); // Get HTTP's DELETE response.

    dispatch({
      type: UPDATE_PROFILE, // If request was successful, dispatch "UPDATE_PROFILE".
      payload: res.data, // Payload will be the user's data.
    });

    dispatch(setAlert("Experience Removed", "success")); // Dispatch "setAlert" action.
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR, // If request was not successful, dispatch "PROFILE_ERROR".
      msg: { msg: err.response.statusText, status: err.response.status }, // Get the message text and status code from the response.
    });
  }
};

// Delete Education.
// Dispatch more than 1 action type from this function. We're able to do it because of the "thunk" middleware, the crucial point is "(id)" (which is allowed by the "thunk" middleware and it wraps an expression to delay its evaluation) then "=>", "async (dispatch)" and "=>" again to do so.
export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`); // Get HTTP's DELETE response.

    dispatch({
      type: UPDATE_PROFILE, // If request was successful, dispatch "UPDATE_PROFILE".
      payload: res.data, // Payload will be the user's data.
    });

    dispatch(setAlert("Education Removed", "success")); // Dispatch "setAlert" action.
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR, // If request was not successful, dispatch "PROFILE_ERROR".
      msg: { msg: err.response.statusText, status: err.response.status }, // Get the message text and status code from the response.
    });
  }
};

// Delete Account & Profile.
// It's not gonna to take any parameter, it'll know the account from the token.
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    // That's a dangerous action to delete an account & profile, therefore wrap this in an "if" statement to confirm it.
    try {
      await axios.delete(`/api/profile`); // Get HTTP's DELETE response.

      dispatch({
        type: CLEAR_PROFILE, // If request was successful, dispatch "CLEAR_PROFILE". There's no payload, just "dispatch".
      });
      dispatch({
        type: ACCOUNT_DELETED, // If request was successful, dispatch "ACCOUNT_DELETED". There's no payload, just "dispatch".
      });

      dispatch(setAlert("Your account has been permanently deleted")); // Dispatch "setAlert" action.
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR, // If request was not successful, dispatch "PROFILE_ERROR".
        msg: { msg: err.response.statusText, status: err.response.status }, // Get the message text and status code from the response.
      });
    }
  }
};
