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
      const user = await User.findById(req.user.id).select("-password"); // We can access it here (in protected route), because the middleware does the job for us to make it accessible. "-password" means don't return/send back (hashed) password.

      // Text comes from the body, but the rest from the user.
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save(); // Save the new post to the variable.
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

// @route   GET api/posts/:id ":id" is a placeholder
// @desc    Get post by ID
// @access  Private (User has to be logged in)
// Middleware is being added as a second parameter always. Whatever route we want to protect, just add "auth" as a second parameter.
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // Find post by ID.

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

// @route   DELETE api/post/:id ":id" is a placeholder
// @desc    Delete a post
// @access  Private (User has to be logged in)
// Middleware is being added as a second parameter always. Whatever route we want to protect, just add "auth" as a second parameter.
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // Find post by ID.

    // Check if there is no post.
    if (!post) {
      return res.status(404).json({ msg: "Post not found" }); // 404 = Not Found.
    }

    // Check if the user which deletes post is not the owner of the post.
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" }); // 401 = Not Authorized.
    }

    await post.remove(); // The user is owner of the post, therefore remove the post.

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

module.exports = router;
