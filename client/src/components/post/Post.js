import { connect } from "react-redux";
import { getPost } from "../../actions/post";
import React, { useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import CommentForm from "../post/CommentForm";
import CommentItem from "../post/CommentItem";
import PostItem from "../posts/PostItem";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";

// Pull out "getPost", so every time we access the property we don't have to do "props.getPost", instead simply use this variable directly "getPost". Same logic applies for "post" and "match". In addition to that, from "post" pull out "post" and "loading".
const Post = ({ getPost, post: { post, loading }, match }) => {
  useEffect(() => {
    getPost(match.params.id); // Get post's ID from the URL.
  }, [getPost]); // The brackets "[]" here makes "useEffect()" to run only it loads, without brackets "useEffect()" will keep running and it'll be a constant loop. The brackets basically are equivalent to "componentDidMount()" in Class Components. ESLint would complain that "getPost" should be added as dependency between the "[]". Therefore, fix this possible warning too.

  // Make sure that the post has been loaded first and then display it without the post's actions.
  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to="/posts" className="btn">
        Back To Posts
      </Link>
      <PostItem post={post} showActions={false} />
      {/* Show comment form with with post ID to which it has to be linked to. */}
      <CommentForm postId={post._id} />
      <div className="comments">
        {/* Loop/map through comments in certain post and output each item. */}
        {post.comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </Fragment>
  );
};

// Make sure "getPost" and "post" props are required.
Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

// Whatever State we want or whatever Prop we wanna call it, here it's "post". "post" comes from the root reducer, accesing this via "state.post" to get the state inside "post". So "props.post" is becoming available for us, or simply "post" nested into an object how it's done here.
const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPost })(Post); // Connect Redux's Actions to the component. Whenever we want to use an Action, we need to pass it to the "connect(...)". First parameter is any state we want to map. The second is an object with any Actions we wanna use. "getPost" allows us to access "props.getPost" or simply "getPost" nested into an object how it's done here. Basically, whenever we want to interact component with Redux (calling an Action or getting a State) we wanna use "connect".
