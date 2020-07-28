import { connect } from "react-redux";
import { login } from "../../actions/auth";
import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

// Pull out "login", so every time we access the property we don't have to do "props.login". Instead, simply "login". Same logic applies for "isAuthenticated".
const Login = ({ login, isAuthenticated }) => {
  // Hooks, pull out state "formData" and use "setFormData" function to update the state from "useState" hook.
  const [formData, setFormData] = useState({
    // Set initial state values.
    email: "",
    password: "",
  });

  const { email, password } = formData; // Pull out these values from form data, so every time we access the property we don't have to do "formData.email" etc.

  const onChange = (e) =>
    setFormData({
      ...formData, // Make a copy of "formData".
      [e.target.name]: e.target.value, // Change the default value with written in in the form value.
    });

  const onSubmit = (e) => {
    e.preventDefault();
    login(email, password); // Call "login" and pass in "email" and "password".
  };

  // Redirect to the Dashboard if user is logged in.
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign In Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
};

// Make sure "login" prop is required and "isAuthenticated" is set to "bool".
Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated, // Whatever State we want or whatever Prop we wanna call it, here it's "isAuthenticated". "isAuthenticated" comes from the root reducer, accesing this via "state.auth.isAuthenticated" to get the state inside "auth.isAuthenticated". So "props.auth.isAuthenticated" is becoming available for us, or simply "auth.isAuthenticated" nested into an object how it's done here.
});

export default connect(mapStateToProps, { login })(Login); // Connect Redux's Actions to the component. Whenever we want to use an Action, we need to pass it to the "connect(...)". First parameter is any state we want to map. The second is an object with any Actions we wanna use. "login" allows us to access "props.login" or simply "login" nested into an object how it's done here. Basically, whenever we want to interact component with Redux (calling an Action or getting a State) we wanna use connect.
