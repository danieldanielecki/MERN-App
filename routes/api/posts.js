const auth = require("../../middleware/auth");
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
const User = require("../../models/User");

// @route   POST api/posts
// @desc    Create a post
// @access  Private (User has to be logged in)
// Middleware is being added as a second parameter always. Because validation and auth middleware must be used together, pass this as an array.
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    // Check for errors.
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Error occured (400 = Bad Request Error), therefore display the error.
    }

    try {
      const user = await User.findById(req.user.id).select("-password"); // We can access it here (in protected route), because the middleware does the job for us to make it accessible. "-password" means don't return/send back (hashed) password. "req.user.id" matches the user which is logged in.

      // Text comes from the body, but the rest from the user.
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id, // "req.user.id" matches the user which is logged in.
      });

      const post = await newPost.save(); // Save the new post to database and to the variable, it returns a Promise.
      res.json(post); // Send back post in HTTP response.
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error"); // General purpose server error, never disclose any sensitive information here.
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private (User has to be logged in)
// Middleware is being added as a second parameter always. Whatever route we want to protect, just add "auth" as a second parameter.
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); // Find posts and show by most recent ones on the top.
    res.json(posts); // Send back posts in HTTP response.
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error"); // General purpose server error, never disclose any sensitive information here.
  }
});

// @route   GET api/posts/:id ":id" is a placeholder.
// @desc    Get post by ID
// @access  Private (User has to be logged in)
// Middleware is being added as a second parameter always. Whatever route we want to protect, just add "auth" as a second parameter.
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // Find post by ID (fetched from URL).

    // Check if there is no post.
    if (!post) {
      return res.status(404).json({ msg: "Post not found" }); // 404 = Not Found.
    }

    res.json(post); // Send back post in HTTP response.
  } catch (err) {
    console.error(err.message);

    // Check if the error is a valid object ID to display the same error message for URL's with valid and invalid object ID.
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" }); // 404 = Not Found.
    }

    res.status(500).send("Server error"); // General purpose server error, never disclose any sensitive information here.
  }
});

// @route   DELETE api/posts/:id ":id" is a placeholder.
// @desc    Delete a post
// @access  Private (User has to be logged in)
// Middleware is being added as a second parameter always. Whatever route we want to protect, just add "auth" as a second parameter.
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // Find post by ID (fetched from URL).

    // Check if there is no post.
    if (!post) {
      return res.status(404).json({ msg: "Post not found" }); // 404 = Not Found.
    }

    // Check if the user which deletes the post is not the owner of the post. "req.user.id" matches the user which is logged in.
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" }); // 401 = Not Authorized.
    }

    await post.remove(); // The user is owner of the post, therefore remove the post from the database.
    res.json({ msg: "Post removed" }); // Send back message in HTTP response.
  } catch (err) {
    // Check if the error is a valid object ID to display the same error message for URL's with valid and invalid object ID.
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" }); // 404 = Not Found.
    }

    console.error(err.message);
    res.status(500).send("Server error"); // General purpose server error, never disclose any sensitive information here.
  }
});

// @route   PUT api/posts/like/:id ":id" is a placeholder.
// @desc    Like a post
// @access  Private (User has to be logged in)
// Middleware is being added as a second parameter always. Whatever route we want to protect, just add "auth" as a second parameter.
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // Find post by ID (fetched from URL).

    // Check if the post has already been liked. "req.user.id" matches the user which is logged in.
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked" }); // 400 = Bad Request Error.
    }

    post.likes.unshift({ user: req.user.id }); // "unshift()" works like "push()", just it pushes the element to the beginning on an array. "req.user.id" matches the user which is logged in.

    await post.save(); // Save the post to the database, it returns a Promise.
    res.json(post.likes); // Send back likes in HTTP response due to React/Redux.
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error"); // General purpose server error, never disclose any sensitive information here.
  }
});

// @route   PUT api/posts/unlike/:id ":id" is a placeholder.
// @desc    Remove a like
// @access  Private (User has to be logged in)
// Middleware is being added as a second parameter always. Whatever route we want to protect, just add "auth" as a second parameter.
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // Find post by ID (fetched from URL).

    // Check if the post has already been liked. "req.user.id" matches the user which is logged in.
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" }); // 400 = Bad Request Error.
    }

    // Get like to be removed by index.
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id); // Find like by ID (fetched from URL).

    post.likes.splice(removeIndex, 1); // Take out the desired like to be removed.

    await post.save(); // Save the post to the database, it returns a Promise.
    res.json(post.likes); // Send back likes in HTTP response due to React/Redux.
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error"); // General purpose server error, never disclose any sensitive information here.
  }
});

// @route   POST api/posts/comment/:id ":id" is a placeholder.
// @desc    Comment on a post
// @access  Private (User has to be logged in)
// Middleware is being added as a second parameter always. Because validation and auth middleware must be used together, pass this as an array.
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    // Check for errors.
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Error occured (400 = Bad Request Error), therefore display the error.
    }

    try {
      const user = await User.findById(req.user.id).select("-password"); // We can access it here (in protected route), because the middleware does the job for us to make it accessible. "-password" means don't return/send back (hashed) password. "req.user.id" matches the user which is logged in.
      const post = await Post.findById(req.params.id); // Find post by ID (fetched from URL).

      // Text comes from the body, but the rest from the user.
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id, // "req.user.id" matches the user which is logged in.
      };

      post.comments.unshift(newComment); // "unshift()" works like "push()", just it pushes the element to the beginning on an array.

      await post.save(); // Save the post comments to database, it returns a Promise.
      res.json(post.comments); // Send back post comments in HTTP response.
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error"); // General purpose server error, never disclose any sensitive information here.
    }
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id ":id" is a placeholder for post ID, ":comment_id" is a placeholder for comment ID.
// @desc    Delete comment
// @access  Private (User has to be logged in)
// Middleware is being added as a second parameter always. Because validation and auth middleware must be used together, pass this as an array.
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // Find post by ID (fetched from URL).

    // Pull out comment.
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    // Check if there is no comment.
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exists" }); // 404 = Not Found.
    }

    // Check if the user which deletes the comment is not the owner of the post. "req.user.id" matches the user which is logged in.
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" }); // 401 = Not Authorized.
    }

    // Get comment to be removed by index.
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id); // Find like by ID (fetched from URL).

    post.comments.splice(removeIndex, 1); // Take out the desired comment to be removed.

    await post.save(); // Save the post to the database, it returns a Promise.
    res.json(post.comments); // Send back comments in HTTP response due to React/Redux.
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error"); // General purpose server error, never disclose any sensitive information here.
  }
});

module.exports = router;
