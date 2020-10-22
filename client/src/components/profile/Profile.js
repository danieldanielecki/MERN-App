import { connect } from "react-redux";
import { getProfileById } from "../../actions/profile";
import { Link } from "react-router-dom";
import React, { useEffect, Fragment } from "react";
import ProfileAbout from "./ProfileAbout";
import ProfileEducation from "./ProfileEducation";
import ProfileExperience from "./ProfileExperience";
import ProfileGithub from "./ProfileGithub";
import ProfileTop from "./ProfileTop";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";

// Pull out "getProfileById", so every time we access the property we don't have to do "props.getProfileById", instead simply use this variable directly "getProfileById". Same logic applies for "profile", "auth" and "match". In addition to that, from "profile" pull out "profile" and "loading".
const Profile = ({
  getProfileById,
  profile: { profile, loading },
  auth,
  match,
}) => {
  // React's Hook "useEffect()", because we're dealing with Functional Components, instead of Class Components and its lifecycle methods such as "componentDidMount()".
  useEffect(() => {
    getProfileById(match.params.id); // Get current profile's ID as soon as the component loads.
  }, [getProfileById, match.params.id]); // The brackets "[]" here makes "useEffect()" to run only it loads, without brackets "useEffect()" will keep running and it'll be a constant loop. The brackets basically are equivalent to "componentDidMount()" in Class Components. ESLint would say that "getProfileById" and "match.params.id" should be added as dependency between the "[]". Therefore, fix these warnings too.

  return (
    <Fragment>
      {/* Since we're getting data and displaying it we want to make sure that the profile/data is loaded. Therefore, as long as it loads - show spinner. That way the UI is not actually rendered unless the data is loaded. */}
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/profiles" className="btn btn-light">
            Back To Profiles
          </Link>
          {/* Check if the user is logged in and the profile if the ID matches then we want to have "Edit" button. Simply, if the profile we're viewing is ours.*/}
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to="/edit-profile" className="btn btn-dark">
                Edit Profile
              </Link>
            )}
          <div className="profile-gri my-1">
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Experience</h2>
              {/* Check if there's any experience, and if so, then display it, otherwise show information about no experience credentials. */}
              {profile.experience.length > 0 ? (
                <Fragment>
                  {/* Loop/map through experiences and output each item. */}
                  {profile.experience.map((experience) => (
                    <ProfileExperience
                      key={experience._id}
                      experience={experience}
                    />
                  ))}
                </Fragment>
              ) : (
                <h4>No experience credentials</h4>
              )}
            </div>
            {/* TODO: The CSS isn't working correctly, because on Brad's videos it shows next to each other, not below. */}
            <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Education</h2>
              {/* Check if there's any education, and if so, then display it, otherwise show information about no education credentials. */}
              {profile.education.length > 0 ? (
                <Fragment>
                  {/* Loop/map through educations and output each item. */}
                  {profile.education.map((education) => (
                    <ProfileEducation
                      key={education._id}
                      education={education}
                    />
                  ))}
                </Fragment>
              ) : (
                <h4>No education credentials</h4>
              )}
            </div>
            {/* Check if GitHub username exists, if so - display it. */}
            {profile.githubusername && (
              <ProfileGithub username={profile.githubusername} />
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

// Make sure "getProfileById", "profile" and "auth" props are required.
Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

// Whatever State we want or whatever Prop we wanna call it, here it's "profile". "profile" comes from the root reducer, accesing this via "state.profile" to get the state inside "profile". So "props.profile" is becoming available for us, or simply "profile" nested into an object how it's done here. Same logic applies for "auth".
const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth, // We want auth, because if the user is logged in and the profile ID will match then we want to have "Edit" button. Simply, if the profile we're viewing is ours.
});

export default connect(mapStateToProps, { getProfileById })(Profile); // Connect Redux's Actions to the component. Whenever we want to use an Action, we need to pass it to the "connect(...)". First parameter is any state we want to map. The second is an object with any Actions we wanna use. "getProfileById" allows us to access "props.getProfileById" or simply "getProfileById" nested into an object how it's done here. Basically, whenever we want to interact component with Redux (calling an Action or getting a State) we wanna use "connect".
