import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import React from "react";
import PropTypes from "prop-types";

// Pull out these values, so every time we access the property we don't have to do, for example, "props.component", instead simply "component". Same logic applies for "auth" and anything else that is passed in ("...rest"). In addition to that, from "auth" pull out "isAuthenticated" and "loading".
const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
  <Route
    {...rest} // Custom props.
    // In "render" is checking if user is authenticated or not.
    render={(props) =>
      // Check if the user is not authenticated and not loading.
      !isAuthenticated && !loading ? (
        // User is not authenticated and not loading, therefore redirect to 'login' page.
        <Redirect to="/login" />
      ) : (
        // User is authenticated then load Component with its props.
        <Component {...props} />
      )
    }
  />
);

// Make sure "auth" is required.
PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth, // Whatever State we want or whatever Prop we wanna call it, here it's "auth". "auth" comes from the root reducer, accesing this via "state.auth" to get the state inside "auth". So "props.auth" is becoming available for us, or simply "auth" nested into an object how it's done here.
});

export default connect(mapStateToProps)(PrivateRoute); // Connect Redux's Actions to the component. Whenever we want to use an Action, we need to pass it to the "connect(...)". First parameter is any state we want to map. There is no second parameter, because there is no Action. Basically, whenever we want to interact component with Redux (calling an Action or getting a State) we wanna use connect.
