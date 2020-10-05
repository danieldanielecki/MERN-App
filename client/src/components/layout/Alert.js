import { connect } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

// Since here is only one expression, which does several checks, curly braces and "return" statement aren't required. If the array is 0 then make sure not to output anything, then map through the alerts and return valid message with the appropriate styling in a JSX format.
const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

// Make sure "alerts" is required.
Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert, // Whatever State we want or whatever Prop we wanna call it, here it's "alerts". "alert" comes from the root reducer, accesing this via "state.alert" to get the state inside "alert". So "props.alerts" is becoming available for us, or simply "alerts" nested into an object how it's done here.
});

export default connect(mapStateToProps)(Alert); // Connect Redux's Actions to the component. Whenever we want to use an Action, we need to pass it to the "connect(...)". First parameter is any state we want to map. There is no second parameter, because there is no Action. Basically, whenever we want to interact component with Redux (calling an Action or getting a State) we wanna use "connect".
