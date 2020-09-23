import { connect } from "react-redux";
import { deleteExperience } from "../../actions/profile";
import React, { Fragment } from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";

// Pull out "experience", so every time we access the property we don't have to do "props.experience". Same logic applies for "deleteExperience".
const Experience = ({ experience, deleteExperience }) => {
  // Get user's experiences.
  const experiences = experience.map((exp) => (
    <tr key={exp._id}>
      <td>{exp.company}</td>
      <td className="hide-sm">{exp.title}</td>
      <td>
        <Moment format="YYYY/MM/DD">{exp.from}</Moment> -{" "}
        {/* Check if the user is still working there and adjust the UI accordingly. */}
        {exp.to === null ? (
          " Now"
        ) : (
          <Moment format="YYYY/MM/DD">{exp.to}</Moment>
        )}
      </td>
      <td>
        <button
          onClick={() => deleteExperience(exp._id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <Fragment>
      <h2 className="my-2">Experience Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th className="hide-sm">Title</th>
            <th className="hide-sm">Years</th>
            {/* Empty "<th />" for "Delete" button. */}
            <th />
          </tr>
        </thead>
        <tbody>{experiences}</tbody>
      </table>
    </Fragment>
  );
};

// Make sure "experience" and "deleteExperience" props are required.
Experience.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired,
};

export default connect(null, { deleteExperience })(Experience);
