import { addEducation } from "../../actions/profile";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom"; // "withRouter" is needed to use "history" object, which redirects user from the action.
import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";

// Pull out "addEducation", so every time we access the property we don't have to do "props.addEducation" , instead simply use this variable directly "addEducation". Same logic applies for "history".
const AddEducation = ({ addEducation, history }) => {
  // Hooks, pull out state "formData" and use "setFormData" function to update the state from "useState" hook.
  const [formData, setFormData] = useState({
    school: "",
    degree: "",
    fieldofstudy: "",
    from: "",
    to: "",
    current: false,
    description: "",
  });

  const [toDateDisabled, toggleDisabled] = useState(false); // Set default state to "false" for displaying "to" date input field and use "toggleDisabled" to toggle its state.

  // Pull out these values from "formData", so every time we access the property we don't have to do "formData.school", instead just "school", etc.
  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  } = formData;

  const onChange = (e) =>
    setFormData({
      ...formData, // Make a copy of "formData".
      [e.target.name]: e.target.value, // Change the default value with what has been written into the form.
    });

  return (
    <Fragment>
      <h1 class="large text-primary">Add Your Education</h1>
      <p class="lead">
        <i class="fas fa-code-branch"></i> Add any school or bootcamp that you
        have attended
      </p>
      <small>* = required field</small>
      <form
        class="form"
        onSubmit={(e) => {
          e.preventDefault(); // Prevent default behavior of a browser.
          addEducation(formData, history); // Add Education.
        }}
      >
        <div class="form-group">
          <input
            type="text"
            placeholder="* School or Bootcamp"
            name="school"
            value={school}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            placeholder="* Degree or Certificate"
            name="degree"
            value={degree}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            placeholder="Field of Study"
            name="fieldofstudy"
            value={fieldofstudy}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div class="form-group">
          <h4>From Date</h4>
          <input
            type="date"
            name="from"
            value={from}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div class="form-group">
          <p>
            <input
              type="checkbox"
              name="current"
              checked={current}
              value={current}
              // Toggle disabled checkbox and set form data with making a copy of "formData" and toggling "current" to the oposit of its current state.
              onChange={(e) => {
                setFormData({ ...formData, current: !current });
                toggleDisabled(!toDateDisabled);
              }}
            />{" "}
            Current School
          </p>
        </div>
        <div class="form-group">
          <h4>To Date</h4>
          <input
            type="date"
            name="to"
            value={to}
            onChange={(e) => onChange(e)}
            // If current state of "toDateDisabled" is "true" then "to" should be disabled.
            disabled={toDateDisabled ? "disabled" : ""}
          />
        </div>
        <div class="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Program Description"
            value={description}
            onChange={(e) => onChange(e)}
          ></textarea>
        </div>
        <input type="submit" class="btn btn-primary my-1" />
        <a class="btn btn-light my-1" href="dashboard.html">
          Go Back
        </a>
      </form>
    </Fragment>
  );
};

// Make sure "addEducation" is required.
AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
};

export default connect(null, { addEducation })(withRouter(AddEducation)); // Connect Redux's Actions to the component. Whenever we want to use an Action, we need to pass it to the "connect(...)". First parameter is any state we want to map, here there's no state therefore "null". The second is an object with any Actions we wanna use. "addEducation" allows us to access "props.addEducation" or simply "addEducation" nested into an object how it's done here.Basically, whenever we want to interact component with Redux (calling an Action or getting a State) we wanna use "connect". "withRouter" has to wrap the "AddEducation" to have the "history" object working and redirecting the user from an Action.
