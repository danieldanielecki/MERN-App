import Landing from "./components/layout/Landing";
import Navbar from "./components/layout/Navbar";
import React, { Fragment } from "react";
import "./App.css";

const App = () => (
  <Fragment>
    <Navbar />
    <Landing />
  </Fragment>
);

export default App;
