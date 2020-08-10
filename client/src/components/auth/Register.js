import { connect } from "react-redux";
import { register } from "../../actions/auth";
import { setAlert } from "../../actions/alert";
import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

// Pull out these values, so every time we access the property we don't have to do "props.setAlert". Same logic applies for "register" and "isAuthenticated".
const Register = ({ setAlert, register, isAuthenticated }) => {
  // Hooks, pull out state "formData" and use "setFormData" function to update the state from "useState" hook.
  const [formData, setFormData] = useState({
    // Set initial state values.
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData; // Pull out these valeus from form data, so every time we access the property we don't have to do "formData.name" etc.

  const onChange = (e) =>
    setFormData({
      ...formData, // Make a copy of "formData".
      [e.target.name]: e.target.value, // Change the default value with written in the form value.
    });

  const onSubmit = (e) => {
    e.preventDefault();

    // Check if passwords don't match.
    if (password !== password2) {
      setAlert("Passwords do not match", "danger"); // Passwords don't match, therefore for now console log this information.
    } else {
      register({ name, email, password }); // Passwords do match, therefore pass into "register" action name, email and password.
    }
  };

  // Redirect to the Dashboard if user registered successfully.
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
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
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            value={password2}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};

// Make sure "setAlert" and "register" props are required and "isAuthenticated" is set to "bool".
Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated, // Whatever State we want or whatever Prop we wanna call it, here it's "isAuthenticated". "isAuthenticated" comes from the root reducer, accesing this via "state.auth.isAuthenticated" to get the state inside "auth.isAuthenticated". So "props.auth.isAuthenticated" is becoming available for us, or simply "auth.isAuthenticated" nested into an object how it's done here.
});

export default connect(mapStateToProps, { setAlert, register })(Register); // Connect Redux's Actions to the component. Whenever we want to use an Action, we need to pass it to the "connect(...)". First parameter is any state we want to map. The second is an object with any Actions we wanna use. "setAlert" allows us to access "props.setAlert" or simply "setAlert" nested into an object how it's done here. Same logic related to "props" applies to "register". Basically, whenever we want to interact component with Redux (calling an Action or getting a State) we wanna use connect.
