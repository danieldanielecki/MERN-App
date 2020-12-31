import "./App.css";
import { loadUser } from "./actions/auth";
import React, { useEffect, Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import setAuthToken from "./utils/setAuthToken";
import store from "./store";
import Landing from "./components/layout/Landing";
import Navbar from "./components/layout/Navbar";
import Routes from "./components/routing/Routes";

// Check if there is a token and if it is then put this into a global header.
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  // React's Hook "useEffect()", because we're dealing with Functional Components, instead of Class Components and its lifecycle methods such as "componentDidMount()".
  useEffect(() => {
    store.dispatch(loadUser()); // The way "loadUser" action can be dispatched is by taking the "story" directly and call "dispatch" method, which is a method on a store and we can simply pass in "loadUser()". Dispatch it as soon as the component loads.
  }, []); // The brackets "[]" here makes "useEffect()" to run only once, without brackets "useEffect()" will keep running and it'll be a constant loop. The brackets basically are equivalent to "componentDidMount()" in Class Components.

  // "<Provider>" must wrap everything, so all component can access the app level state.
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>
            <Route component={Landing} exact path="/" />
            <Route component={Routes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
