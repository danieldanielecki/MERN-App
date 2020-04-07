const auth = require("../../middleware/auth");
const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// @route   GET api/auth
// @desc    Test route
// @access  Public
// Middleware is being added as second parameter always.
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // We can access it here (in protected route), because the middleware does the job for us to make it accessible. "-password" means don't return (hashed) password.
    res.json(user); // Send a user in HTTP response.
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error"); // General purpose server error, never disclose any sensitive information here.
  }
});

module.exports = router;
