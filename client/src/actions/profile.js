import axios from "axios";
import { setAlert } from "./alert";
import { GET_PROFILE, PROFILE_ERROR } from "./types";

// Get current user's profile.
// Dispatch more than 1 action type from this function. We're able to do it because of the "thunk" middleware, the crucial point it "()" then "=>", "(dispatch)" and "=>" again to do so.
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
