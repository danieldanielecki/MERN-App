import { connect } from "react-redux";
import { deleteEducation } from "../../actions/profile";
import React, { Fragment } from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";

// Pull out "education", so every time we access the property we don't have to do "props.education", instead simply use this variable directly "education". Same logic applies for "deleteEducation".
const Education = ({ education, deleteEducation }) => {
  // Get user's educations.
  const educations = education.map((edu) => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td className="hide-sm">{edu.degree}</td>
      <td>
        <Moment format="YYYY/MM/DD">{edu.from}</Moment> -{" "}
        {/* Check if the user is still working there and adjust the UI accordingly. */}
        {edu.to === null ? (
          " Now"
        ) : (
          <Moment format="YYYY/MM/DD">{edu.to}</Moment>
        )}
      </td>
      <td>
        <button
          onClick={() => deleteEducation(edu._id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <Fragment>
      <h2 className="my-2">Education Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th className="hide-sm">Degree</th>
            <th className="hide-sm">Years</th>
            {/* Empty "<th />" for "Delete" button. */}
            <th />
          </tr>
        </thead>
        <tbody>{educations}</tbody>
      </table>
    </Fragment>
  );
};

// Make sure "education" and "deleteEducation" props are required.
Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired,
};

export default connect(null, { deleteEducation })(Education);
