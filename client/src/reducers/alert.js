import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

const initialState = []; // Initial state is just an empty array.

export default function (state = initialState, action) {
  const { type, payload } = action; // Pull out these valeus from the action, so every time we access the property we don't have to do "action.type" etc.

  switch (type) {
    case SET_ALERT:
      return [...state, payload]; // State is immutable, therefore when adding another one it'll be an array. That's why we need to use spread operator to return all of them. On top of this, add a new alert, which is in the "action.payload".
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload); // Remove specific alert by its ID by removing all alerts except this one which matches the payload.
    default:
      return state; // Every reducer we create will have a default case with returning a state.
  }
}
