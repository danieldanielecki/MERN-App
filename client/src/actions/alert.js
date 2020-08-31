import { v4 as uuid } from "uuid";
import { SET_ALERT, REMOVE_ALERT } from "./types";

// Dispatch more than 1 action type from this function. We're able to do it because of the "thunk" middleware, the crucial point is "(msg, alertType)" parameters then "=>", "(dispatch)" and "=>" again to do so.
export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  const id = uuid();

  // Dispatch setting an alert with message, alert type and its ID in payload.
  dispatch({
    type: SET_ALERT,
    payload: {
      msg,
      alertType,
      id,
    },
  });

  // Dispatch removing an alert with an ID as a payload after specific time (default: 5 seconds). TODO: This alert doesn't disappears on the UI, however it works fine in the Redux DevTools.
  setTimeout(
    () =>
      dispatch({
        type: REMOVE_ALERT,
        payload: {
          id,
        },
      }),
    timeout
  );
};
