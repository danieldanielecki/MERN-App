import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";

// Pull out "isAuthenticated", so every time we access the property we don't have to do "props.isAuthenticated", instead simply use this variable directly "isAuthenticated".
export const Landing = ({ isAuthenticated }) => {
  // Redirect to the Dashboard if user is logged in.
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Developer Connector</h1>
          <p className="lead">
            Create a developer profile/portfolio, share posts and get help from
            other developers
          </p>
          <div className="buttons">
            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
            <Link to="/login" className="btn btn-light">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// Make sure "isAuthenticated" is set to "bool".
Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated, // Whatever State we want or whatever Prop we wanna call it, here it's "isAuthenticated". "isAuthenticated" comes from the root reducer, accesing this via "state.auth.isAuthenticated" to get the state inside "auth.isAuthenticated". So "props.auth.isAuthenticated" is becoming available for us, or simply "auth.isAuthenticated" nested into an object how it's done here.
});

export default connect(mapStateToProps)(Landing); // Connect Redux's Actions to the component. Whenever we want to use an Action, we need to pass it to the "connect(...)". First parameter is any state we want to map. There is no second parameter, because there is no Action. Basically, whenever we want to interact component with Redux (calling an Action or getting a State) we wanna use "connect".
