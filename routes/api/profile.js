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
      user: req.user.id, // Equivalent to "mongoose.Schema.Types.ObjectId" in Profile model. Get user by ID from the token.
    }).populate("user", ["name", "avatar"]); // Populate name and avatar from User model.

    // Check if there is no profile.
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile); // Send back profile in response.
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
    profileFields.user = req.user.id; // Get user by ID from the token.
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
      let profile = await Profile.findOne({ user: req.user.id }); // Get user by ID from the token.

      // Check if profile exists.
      if (profile) {
        // Update the profile.
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id }, // Get user by ID from the token.
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile); // Send back profile in response.
      }

      profile = new Profile(profileFields); // Create profile.

      await profile.save(); // Save profile.
      res.json(profile); // Send back profile in response.
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error"); // General purpose server error, never disclose any sensitive information here.
    }
  }
);

// @route GET api/profile
// @desc Get all profiles
// @access Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]); // Populate name and avatar from User model.
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error"); // General purpose server error, never disclose any sensitive information here.
  }
});

// @route GET api/profile/user/:user_id ":user_id" is a placeholder
// @desc Get profile by user ID
// @access Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]); // Populate name and avatar from User model.

    // Check if there is no profile for this "user_id".
    if (!profile) return res.status(400).json({ msg: "Profile not found" });

    res.json(profile); // Send back profile in response.
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }

    res.status(500).send("Server Error"); // General purpose server error, never disclose any sensitive information here.
  }
});

// @route DELETE api/profile
// @desc Delete profile, user & posts
// @access Private
// Middleware is being added as a second parameter always. Whatever route we want to protect, just add "auth" as a second parameter.
router.delete("/", auth, async (req, res) => {
  try {
    // @todo - remove users posts
    await Profile.findOneAndRemove({ user: req.user.id }); // Remove Profile by ID based on the token.
    await User.findOneAndRemove({ _id: req.user.id }); // Remove User by ID based on the token.

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error"); // General purpose server error, never disclose any sensitive information here.
  }
});

// @route PUT api/profile/experience
// @desc Add Profile experience
// @access Private
// Middleware is being added as a second parameter always. Because validation and auth middleware must be used together, pass this as an array.
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // Check for errors.
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Error occured, therefore display the error.
    }

    // Pull that details out from "req.body".
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    // Create object with data that the user submits.
    const newExp = {
      title, // Equivalent to "title:title"
      company, // Equivalent to "company:company" etc...
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id }); // Get user by ID from the token.

      profile.experience.unshift(newExp); // "unshift()" works like "push()", just it pushes the element to the beginning on an array.

      await profile.save(); // Save profile.
      res.json(profile); // Send back profile in response.
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error"); // General purpose server error, never disclose any sensitive information here.
    }
  }
);

// @route DELETE api/profile/experience/:exp_id ":exp_id" is a placeholder
// @desc Delete experience from Profile
// @access Private
// Middleware is being added as a second parameter always. Whatever route we want to protect, just add "auth" as a second parameter.
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }); // Get user by ID from the token.

    // Get experience to be removed by index.
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1); //Take out the desired experience to be removed.

    await profile.save(); // Save profile.
    res.json(profile); // Send back profile in response.
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error"); // General purpose server error, never disclose any sensitive information here.
  }
});

module.exports = router;
