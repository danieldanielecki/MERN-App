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
      return res.status(400).json({ errors: errors.array() }); // Error occured, therefore display the error.
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

module.exports = router;
