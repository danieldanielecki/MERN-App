import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profile";
import React, { useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import DashboardActions from "./DashboardActions";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";

// Pull out these values, so every time we access the property we don't have to do, for example, "props.getCurrentProfile", instead simply "getCurrentProfile". Same logic applies for "auth" and "profile". In addition to that, from "profile" pull out "profile" and "loading" as well as "user" from "auth".
const Dashboard = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading },
}) => {
  // React's Hook "useEffect()", because we're dealing with Functional Components, instead of Class Components and its lifecycle methods such as "componentDidMount()".
  useEffect(() => {
    getCurrentProfile(); // Get current profile as soon as the component loads.
  }, []); // The brackets "[]" here makes "useEffect()" to run only once, without brackets "useEffect()" will keep running and it'll be a constant loop. The brackets basically are equivalent to "componentDidMount()" in Class Components.

  // If the "profile" is "null" and the its still loading then we wanna show the spinner.
  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        {/* Show user name only if the user is there. That's a shorthand for "if user exists then show its name.". */}
        <i className="fas fa-user"></i> {user && user.name}
      </p>
      {/* Show different text based on if profile exists. */}
      {profile !== null ? (
        <Fragment>
          <DashboardActions />
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

// Make sure "getCurrentProfile", "auth" and "profile" props are required.
Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

// Whatever State we want or whatever Prop we wanna call it, here it's "auth". "auth" comes from the root reducer, accesing this via "state.auth" to get the state inside "auth". So "props.auth" is becoming available for us, or simply "auth" nested into an object how it's done here. Same logic applies for "profile".
const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard); // Connect Redux's Actions to the component. Whenever we want to use an Action, we need to pass it to the "connect(...)". First parameter is any state we want to map. The second is an object with any Actions we wanna use. "getCurrentProfile" allows us to access "props.getCurrentProfile" or simply "getCurrentProfile" nested into an object how it's done here. Basically, whenever we want to interact component with Redux (calling an Action or getting a State) we wanna use connect.
