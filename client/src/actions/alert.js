import uuid from "uuid";
import { SET_ALERT, REMOVE_ALERT } from "./types";

// Dispatch more than 1 action type from this function. We're able to do it because of the "thunk" middleware, the crucial point it "(msg, alertType)" parameters then "=>", "(dispatch)" and "=>" again to do so.
export const setAlert = (msg, alertType) => (dispatch) => {
  const id = uuid.v4();
  dispatch({
    type: SET_ALERT,
    payload: {
      msg,
      alertType,
      id,
    },
  });
};
