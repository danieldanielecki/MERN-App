import Moment from "react-moment";
import PropTypes from "prop-types";
import React from "react";

// Pull out "education", so every time we access the property we don't have to do "props.education", instead simply use this variable directly "education". In addition to that, from "education" pull out "school", "degree", "fieldofstudy", "current", "to", "from" and "description".
const ProfileEducation = ({
  education: { school, degree, fieldofstudy, current, to, from, description },
}) => (
  <div>
    <h3 className="text-dark">{school}</h3>
    <p>
      <Moment format="YYYY/MM/DD">{from}</Moment> -{" "}
      {/* Display information/date depending on if the person is still working there. */}
      {!to ? " Now" : <Moment format="YYYY/MM/DD">{to}</Moment>}
    </p>
    <p>
      <strong>Degree: </strong> {degree}
    </p>
    <p>
      <strong>Field Of Study: </strong> {fieldofstudy}
    </p>
    <p>
      <strong>Description: </strong> {description}
    </p>
  </div>
);
// Make sure "education" prop is required.
ProfileEducation.propTypes = {
  education: PropTypes.array.isRequired,
};

export default ProfileEducation;
