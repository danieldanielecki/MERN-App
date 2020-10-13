import { connect } from "react-redux";
import { getProfiles } from "../../actions/profile";
import React, { useEffect, Fragment } from "react";
import ProfileItem from "./ProfileItem";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";

// Pull out these values, so every time we access the property we don't have to do, for example, "props.getProfiles", instead simply use this variable directly "getProfiles". Same logic applies for "profile". In addition to that, from "profile" pull out "profile" and "loading".
const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  // React's Hook "useEffect()", because we're dealing with Functional Components, instead of Class Components and its lifecycle methods such as "componentDidMount()".
  useEffect(() => {
    getProfiles(); // Get profiles as soon as the component loads.
  }, [getProfiles]); // The brackets "[]" here makes "useEffect()" to run only once, without brackets "useEffect()" will keep running and it'll be a constant loop. The brackets basically are equivalent to "componentDidMount()" in Class Components. ESLint said that "getProfiles" should be added as dependency between the "[]". Therefore, fix this warning too.

  return (
    <Fragment>
      {/* Since we're getting data and displaying it we want to make sure that the profiles/data is loaded. Therefore, as long as it loads - show spinner. That way the UI is not actually rendered unless the data is loaded. */}
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <i className="fab fa-fa-connectdevelop"></i> Browser and connect
            with developers
          </p>
          <div className="profiles">
            {/* Check if there are any profiles. */}
            {profiles.length > 0 ? (
              // Loop/map through profiles and output each item.
              profiles.map((profile) => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No profiles found...</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

// Make sure "getProfiles" and "profile" props are required.
Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile, // Whatever State we want or whatever Prop we wanna call it, here it's "profile". "profile" comes from the root reducer, accesing this via "state.profile" to get the state inside "profile". So "props.profile" is becoming available for us, or simply "profile" nested into an object how it's done here.
});

export default connect(mapStateToProps, { getProfiles })(Profiles); // Connect Redux's Actions to the component. Whenever we want to use an Action, we need to pass it to the "connect(...)". First parameter is any state we want to map. The second is an object with any Actions we wanna use. "getProfiles" allows us to access "props.getProfiles" or simply "getProfiles" nested into an object how it's done here. Basically, whenever we want to interact component with Redux (calling an Action or getting a State) we wanna use "connect".
