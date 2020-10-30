import { connect } from "react-redux";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import PropTypes from "prop-types";

// Pull out "auth", so every time we access the property we don't have to do "props.auth", instead simply use this variable directly "auth". Same logic applies for "post". In addition to that, from "post" pull out "_id", "text", "name", "avatar", "user", "likes", "comments" and "date".
const PostItem = ({
  auth,
  post: { _id, text, name, avatar, user, likes, comments, date },
}) => (
  <div class="post bg-white p-1 my-1">
    <div>
      <a href="profile.html">
        <img class="round-img" src={avatar} alt="" />
        <h4>{name}</h4>
      </a>
    </div>
    <div>
      <p class="my-1">{text}</p>
      <p class="post-date">
        Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
      </p>
      <button type="button" class="btn btn-light">
        <i class="fas fa-thumbs-up" />{" "}
        <span>
          {/* Before displaying length of the likes make sure likes exists. */}
          {likes.length > 0 && <span>{likes.length}</span>}
        </span>
      </button>
      <button type="button" class="btn btn-light">
        <i class="fas fa-thumbs-down" />
      </button>
      <Link to={`/post/${_id}`} class="btn btn-primary">
        {/* Before displaying length of the comments make sure comments exists. */}
        Discussion{" "}
        {comments.length > 0 && (
          <span class="comment-count">{comments.length}</span>
        )}
      </Link>
      {/* We need to tell who is who, so the delete button shows only for user to whom the post belongs to. The "user" is a post's user and the "auth.user._id" is a logged in user. */}
      {/* TODO: Check if delete button is being shown after it'll be possible to add posts, because now there are only old posts. */}
      {!auth.loading && user === auth.user._id && (
        <button type="button" class="btn btn-danger">
          <i class="fas fa-times" />
        </button>
      )}
    </div>
  </div>
);

// Make sure "post" and "auth" props are required.
PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth, // Whatever State we want or whatever Prop we wanna call it, here it's "auth". "auth" comes from the root reducer, accesing this via "state.auth" to get the state inside "auth". So "props.auth" is becoming available for us, or simply "auth" nested into an object how it's done here.
});

export default connect(mapStateToProps, {})(PostItem); // Connect Redux's Actions to the component. Whenever we want to use an Action, we need to pass it to the "connect(...)". First parameter is any state we want to map. The second is an object with any Actions we wanna use, here there's no Action therefore "null". Basically, whenever we want to interact component with Redux (calling an Action or getting a State) we wanna use "connect".
