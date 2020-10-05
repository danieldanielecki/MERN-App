import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Pull out these values, so every time we access the property we don't have to do, for example, "props.auth", instead simply use this variable directly "auth". Same logic applies for "logout". In addition to that, from "auth" pull out "isAuthenticated" and "loading".
export const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to="/profiles">Developers</Link>
      </li>
      <li>
        <Link to="/dashboard">
          <i className="fas fa-user" />{" "}
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li>
        <a href="#!" onClick={logout}>
          <i className="fas fa-sign-out-alt" />{" "}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestsLinks = (
    <ul>
      <li>
        <Link to="/profiles">Developers</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> DevConnector
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestsLinks}</Fragment>
      )}
    </nav>
  );
};

// Make sure "logout" and "auth" props are required.
Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth, // Whatever State we want or whatever Prop we wanna call it, here it's "auth". "auth" comes from the root reducer, accesing this via "state.auth" to get the state inside "auth". So "props.auth" is becoming available for us, or simply "auth" nested into an object how it's done here.
});

export default connect(mapStateToProps, { logout })(Navbar); // Connect Redux's Actions to the component. Whenever we want to use an Action, we need to pass it to the "connect(...)". First parameter is any state we want to map. The second is an object with any Actions we wanna use. "logout" allows us to access "props.logout" or simply "logout" nested into an object how it's done here. Basically, whenever we want to interact component with Redux (calling an Action or getting a State) we wanna use "connect".
