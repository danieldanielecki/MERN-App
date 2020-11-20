import { addComment } from "../../actions/post";
import { connect } from "react-redux";
import React, { useState } from "react";
import PropTypes from "prop-types";

// Pull out "addComment", so every time we access the property we don't have to do "props.addComment", instead simply use this variable directly "addComment". Same logic applies for "postId".
const CommentForm = ({ addComment, postId }) => {
  const [text, setText] = useState(""); // Since we only have 1 field for this form it'll be an empty string instead of "formData" object which was used before.

  return (
    <div class="post-form">
      <div class="bg-primary p">
        <h3>Leave a Comment</h3>
      </div>
      <form
        class="form my-1"
        onSubmit={(e) => {
          e.preventDefault();
          addComment(postId, { text }); // "text" is a "formData" within the Action function. (whatever it means...) with post ID, so we know to which post add the comment.
          setText(""); // Clear form.
        }}
      >
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Create a post"
          value={text}
          onChange={(e) => setText(e.target.value)} // Set text to whatever is in the textbox.
          required
        ></textarea>
        <input type="submit" class="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

// Make sure "addComment" prop is required.
CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
};

export default connect(null, { addComment })(CommentForm); // Connect Redux's Actions to the component. Whenever we want to use an Action, we need to pass it to the "connect(...)". First parameter is any state we want to map, here there's no state therefore "null". The second is an object with any Actions we wanna use. "addComment" allows us to access "props.addComment" or simply "addComment" nested into an object how it's done here. Basically, whenever we want to interact component with Redux (calling an Action or getting a State) we wanna use "connect".
