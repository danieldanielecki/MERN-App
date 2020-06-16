import axios from "axios";
import { setAlert } from "./alert";
import { REGISTER_SUCCESS, REGISTER_FAIL } from "./types";

// TODO: place this description somewhere. Using JSON Web Token (JWT) is a stateless form of authentication. So actually we have to keep querying the server and see if the token on frontend matches that one on the backend. It'll be done int action "api/auth" route.
// Register User action.
// Dispatch more than 1 action type from this function.We're able to do it because of the "thunk" middleware, the crucial point it "({ name, email, password })" parameters then "=>", "(dispatch)" and "=>" again to do so.
export const register = ({ name, email, password }) => async (dispatch) => {
  // Create config object with HTTP headers.
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ name, email, password }); // Prepare the data to send.

  try {
    const res = await axios.post("/api/users", body, config); // Get HTTP response.

    // Dispatch an action when registration has been successful.
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data, // In this case the data we're getting back is a token.
    });
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
