import PropTypes from "prop-types";
import React from "react";

// Pull out "profile", so every time we access the property we don't have to do "props.profile", instead simply use this variable directly "profile". In addition to that, from "profile" pull out "status", "company", "location", "website", "social" and "user". On top of that, from "user" pull out "name" and "avatar".
const ProfileTop = ({
  profile: {
    status,
    company,
    location,
    website,
    social,
    user: { name, avatar },
  },
}) => {
  return (
    <div className="profile-top bg-primary p-2">
      <img className="round-img my-1" src={avatar} alt="" />
      <h1 className="large">{name}</h1>
      {/* Check if there's a company, and if so, then display it. */}
      <p className="lead">
        {status} {company && <span> at {company}</span>}
      </p>
      {/* Check if there's a location, and if so, then display it. */}
      <p>{location && <span>{location}</span>}</p>
      <div className="icons my-1">
        {website && (
          <a href={website} target="_blank" rel="noopener noreferrer">
            <i className="fas fa-globe fa-2x"></i>
          </a>
        )}
        {social && social.twitter && (
          <a href={social.twitter} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter fa-2x"></i>
          </a>
        )}
        {social && social.facebook && (
          <a href={social.facebook} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook fa-2x"></i>
          </a>
        )}
        {social && social.linkedin && (
          <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin fa-2x"></i>
          </a>
        )}
        {social && social.youtube && (
          <a href={social.youtube} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-youtube fa-2x"></i>
          </a>
        )}
        {social && social.instagram && (
          <a href={social.instagram} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram fa-2x"></i>
          </a>
        )}
      </div>
      <div className="icons my-1"></div>
    </div>
  );
};

// Make sure "profile" prop is required.
ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileTop;
