import rootReducer from "./reducers"; // The "index.js" will be taken automatically from this folder.
import thunk from "redux-thunk";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

const initialState = {}; // Initial state is just an empty object.

const middleware = [thunk]; // The only one middleware is "thunk".

// Create Redux store, after this we no longer need to touch this.
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
