const auth = require("../../middleware/auth");
const express = require("express");
const router = express.Router();

const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
// Middleware is being added as a second parameter always. Whatever route we want to protect, just add "auth" as a second parameter.
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id, // Equivalent to "mongoose.Schema.Types.ObjectId" in Profile model.
    }).populate("user", ["name", "avatar"]); // Populate name and avatar from User model.

    // Check if there is no profile.
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile); // Send the profile.
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error"); // General purpose server error, never disclose any sensitive information here.
  }
});

module.exports = router;
