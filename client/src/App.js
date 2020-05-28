import store from "./store";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Navbar from "./components/layout/Navbar";
import Register from "./components/auth/Register";
import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import "./App.css";

const App = () => (
  // "<Provider>" must wrap everything, so all component can access the app level state.
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Route component={Landing} exact path="/" />
        <section className="container">
          <Switch>
            <Route component={Register} exact path="/register" />
            <Route component={Login} exact path="/login" />
          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>
);

export default App;
