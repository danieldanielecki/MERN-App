import { connect } from "react-redux";
import { getPosts } from "../../actions/post";
import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";

// Pull out "getPosts", so every time we access the property we don't have to do "props.getPosts", instead simply use this variable directly "getPosts". Same logic applies for "post". In addition to that, from "post" pull out "posts" and "loading".
const Posts = ({ getPosts, post: { posts, loading } }) => {
  // React's Hook "useEffect()", because we're dealing with Functional Components, instead of Class Components and its lifecycle methods such as "componentDidMount()".
  useEffect(() => {
    getPosts(); // Get posts as soon as the component loads.
  }, [getPosts]); // The brackets "[]" here makes "useEffect()" to run only it loads, without brackets "useEffect()" will keep running and it'll be a constant loop. The brackets basically are equivalent to "componentDidMount()" in Class Components. ESLint would complain that "getPosts" should be added as dependency between the "[]". Therefore, fix this possible warning too.

  return <div></div>;
};

// Make sure "getPosts" and "post" props are required.
Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

// Whatever State we want or whatever Prop we wanna call it, here it's "post". "post" comes from the root reducer, accesing this via "state.post" to get the state inside "post". So "props.post" is becoming available for us, or simply "post" nested into an object how it's done here.
const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPosts })(Posts); // Connect Redux's Actions to the component. Whenever we want to use an Action, we need to pass it to the "connect(...)". First parameter is any state we want to map. The second is an object with any Actions we wanna use. "getPosts" allows us to access "props.getPosts" or simply "getPosts" nested into an object how it's done here. Basically, whenever we want to interact component with Redux (calling an Action or getting a State) we wanna use "connect".
