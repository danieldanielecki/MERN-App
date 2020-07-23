import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profile";
import React, { useEffect } from "react";
import PropTypes from "prop-types";

const Dashboard = ({ getCurrentProfile, auth, profile }) => {
  // React's Hook "useEffect()", because we're dealing with Functional Components, instead of Class Components and its lifecycle methods such as "componentDidMount()".
  useEffect(() => {
    getCurrentProfile(); // Get current profile as soon as the component loads.
  }, []); // The brackets "[]" here makes "useEffect()" to run only once, without brackets "useEffect()" will keep running and it'll be a constant loop. The brackets basically is equivalent to "componentDidMount()" in Class Components.

  return <div>Dashboard</div>;
};

// Make sure "getCurrentProfile", "auth" and "profile" props are required.
Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

// Whatever State we want or whatever Prop we wanna call it, here it's "auth". "auth" comes from the root reducer, accesing this via "state.auth" to get the state inside "auth". So "props.auth" is becoming available for us, or simply "auth"  nested into an object how it's done here. Same logic applies for "profile".
const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard); // Connect Redux's Actions to the component. Whenever we want to use an Action, we need to pass it to the "connect(...)". First parameter is any state we want to map. The second is an object with any Actions we wanna use. "getCurrentProfile" allows us to access "props.getCurrentProfile" or simply "getCurrentProfile" nested into an object how it's done here. Basically, whenever we want to interact component with Redux (calling an Action or getting a State) we wanna use connect.
