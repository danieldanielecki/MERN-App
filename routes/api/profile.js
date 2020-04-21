// Whenever Mongoose's methods are being used we need to use await, because it returns a Promise.
const auth = require("../../middleware/auth");
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   GET api/profile/me
// @desc    Get current user's profile
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

// @route   POST api/profile
// @desc    Create or update user's profile
// @access  Private
// Middleware is being added as a second parameter always. Because validation and auth middleware must be used together, pass this as an array.
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // Check for errors.
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Error occured, therefore display the error.
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    /* Build profile object. */
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim()); // Turn string into an array by setting delimiter to "," to separate the string word's. "trim()" removes whitespaces.
    }
    // Build social object.
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id }); // Get user from the token.

      // Check if profile exists.
      if (profile) {
        // Update the profile.
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      profile = new Profile(profileFields); // Create profile.
      await profile.save(); // Save profile.
      res.json(profile); // Send back profile.
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error"); // General purpose server error, never disclose any sensitive information here.
    }
  }
);

module.exports = router;
