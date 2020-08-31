import axios from "axios";
import { setAlert } from "./alert";
import { GET_PROFILE, PROFILE_ERROR } from "./types";

// Get current user's profile.
// Dispatch more than 1 action type from this function. We're able to do it because of the "thunk" middleware, the crucial point is "()" then "=>", "(dispatch)" and "=>" again to do so.
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

// Create or update profile.
// Dispatch more than 1 action type from this function. We're able to do it because of the "thunk" middleware, the crucial point is "(formData, history, edit = false)" parameters then "=>", "(dispatch)" and "=>" again to do so. "formData" will have some data. "history" has method called "push" which will redirect us to client side routes. "edit" is for letting know if we're updating/editing or creating a new profile.
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

    const res = await axios.post("/api/profile", formData, config); // Get HTTP response.

    dispatch({
      type: GET_PROFILE, // If request was successful, dispatch "GET_PROFILE".
      payload: res.data, // Payload will be the user's data.
    });

    // Message should be different depending if the profile is updated or created.
    dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"));

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
