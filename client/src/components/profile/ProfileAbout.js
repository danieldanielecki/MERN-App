import React, { Fragment } from "react";
import PropTypes from "prop-types";

// Pull out "profile", so every time we access the property we don't have to do "props.profile", instead simply use this variable directly "profile".  In addition to that, from "profile" pull out "bio", "skills" and "user". On top of that, from "user" pull out "name".
const ProfileAbout = ({
  profile: {
    bio,
    skills,
    user: { name },
  },
}) => (
  <div class="profile-about bg-light p-2">
    {/* Check if there's a bio, and if so, then display it. */}
    {bio && (
      <Fragment>
        {/* Display only the first name. */}
        <h2 class="text-primary">{name.trim().split(" ")[0]}s Bio</h2>
        <p>{bio}</p>
        <div class="line"></div>
      </Fragment>
    )}
    <h2 class="text-primary">Skill Set</h2>
    <div class="skills">
      {/* Loop/map through skills and output each item. */}
      {skills.map((skill, index) => (
        <div key={index} class="p-1">
          <i class="fas fa-check"></i> {skill}
        </div>
      ))}
    </div>
  </div>
);

// Make sure "profile" prop is required.
ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileAbout;
