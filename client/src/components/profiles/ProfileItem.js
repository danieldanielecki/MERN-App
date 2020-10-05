import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";

// We don't need "connect" or anything. The "ProfileItem" is just a holder, we're passing in profile data, which is pulled out from the "props" here.
// Pull out "profile", so every time we access the property we don't have to do "props.profile", instead simply use this variable directly "profile". In addition to that, from "profile" pull out "user", "status", "company", "location" and "skills". On top of this, from "user" pull out "_id", "name" and "avatar".
const ProfileItem = ({
  profile: {
    user: { _id, name, avatar },
    status,
    company,
    location,
    skills,
  },
}) => {
  return (
    <div className="profile bg-light">
      <img src={avatar} alt="" className="round-img" />
      <div>
        <h2>{name}</h2>
        <p>
          {status} {company && <span> at {company}</span>}
        </p>
        <p className="my-1">{location && <span>{location}</span>}</p>
        <Link to={`/profile/${_id}`} className="btn btn-primary">
          View Profile
        </Link>
      </div>
      <ul>
        {/* Show only maximum 4 skills. */}
        {skills.slice(0, 4).map((skill, index) => (
          // Use "index" as a key, because "skills" that's just an array and there's no ID, because it has to be unique.
          <li key={index} className="text-primary">
            <i className="fas fa-check"></i> {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Make sure "profile" is required.
ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileItem;
