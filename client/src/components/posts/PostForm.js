import { addPost } from "../../actions/post";
import { connect } from "react-redux";
import React, { useState } from "react";
import PropTypes from "prop-types";

// Pull out "addPost", so every time we access the property we don't have to do "props.addPost", instead simply use this variable directly "addPost".
const PostForm = ({ addPost }) => {
  const [text, setText] = useState(""); // Since we only have 1 field for this form it'll be an empty string instead of "formData" object which was used before.

  return (
    <div class="post-form">
      <div class="bg-primary p">
        <h3>Say Something...</h3>
      </div>
      <form
        class="form my-1"
        onSubmit={(e) => {
          e.preventDefault();
          addPost({ text }); // "text" is a "formData" within the Action function. (whatever it means...)
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

// Make sure "addPost" prop is required.
PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default connect(null, { addPost })(PostForm); // Connect Redux's Actions to the component. Whenever we want to use an Action, we need to pass it to the "connect(...)". First parameter is any state we want to map, here there's no state therefore "null". The second is an object with any Actions we wanna use. "addPost" allows us to access "props.addPost" or simply "addPost" nested into an object how it's done here. Basically, whenever we want to interact component with Redux (calling an Action or getting a State) we wanna use "connect".
