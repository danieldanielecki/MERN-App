import { connect } from "react-redux";
import React, { Fragment } from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";

// Pull out "education", so every time we access the property we don't have to do "props.education".
const Education = ({ education }) => {
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
        <button className="btn btn-danger">Delete</button>
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

// Make sure "education" prop is required.
Education.propTypes = {
  education: PropTypes.array.isRequired,
};

export default Education;
