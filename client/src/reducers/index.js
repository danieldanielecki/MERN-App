import alert from "./alert";
import auth from "./auth";
import { combineReducers } from "redux";

// The "combineReducers" object will have all reducers we create.
export default combineReducers({
  alert,
  auth,
});
