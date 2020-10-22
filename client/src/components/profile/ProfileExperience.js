import Moment from "react-moment";
import PropTypes from "prop-types";
import React from "react";

// Pull out "experience", so every time we access the property we don't have to do "props.experience", instead simply use this variable directly "experience". In addition to that, from "experience" pull out "company", "title", "current", "to", "from" and "description".
const ProfileExperience = ({
  experience: { company, title, location, current, to, from, description },
}) => (
  <div>
    <h3 className="text-dark">{company}</h3>
    <p>
      <Moment format="YYYY/MM/DD">{from}</Moment> -{" "}
      {/* Display information/date depending on if the person is still working there. */}
      {!to ? " Now" : <Moment format="YYYY/MM/DD">{to}</Moment>}
    </p>
    <p>
      <strong>Position: </strong> {title}
    </p>
    <p>
      <strong>Description: </strong> {description}
    </p>
  </div>
);

// Make sure "experience" prop is required.
ProfileExperience.propTypes = {
  experience: PropTypes.array.isRequired,
};

export default ProfileExperience;
