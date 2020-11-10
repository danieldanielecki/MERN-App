// Whenever Mongoose's methods are being used we need to use await, because it returns a Promise.
const auth = require("../../middleware/auth");
const config = require("config");
const express = require("express");
const request = require("request");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private (User has to be logged in)
// Middleware is being added as a second parameter always. Whatever route we want to protect, just add "auth" as a second parameter.
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id, // Equivalent to "mongoose.Schema.Types.ObjectId" in Profile model. Get user by ID from the token. "req.user.id" matches the user which is logged in.
    }).populate("user", ["name", "avatar"]); // Populate name and avatar from User model.

    // Check if there is no profile.
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" }); // 400 = Bad Request Error.
    }

    res.json(profile); // Send back profile in HTTP response.
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error"); // General purpose server error, never disclose any sensitive information here.
  }
});

// @route   POST api/profile
// @desc    Create or update user's profile
// @access  Private (User has to be logged in)
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
      return res.status(400).json({ errors: errors.array() }); // Error occured (400 = Bad Request Error), therefore display the error.
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
    profileFields.user = req.user.id; // Get user by ID from the token. "req.user.id" matches the user which is logged in.
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
      let profile = await Profile.findOne({ user: req.user.id }); // Get user by ID from the token. "req.user.id" matches the user which is logged in.

      // Check if profile exists.
      if (profile) {
        // Update the profile.
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id }, // Get user by ID from the token. "req.user.id" matches the user which is logged in.
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile); // Send back profile in HTTP response.
      }

      profile = new Profile(profileFields); // Create profile.

      await profile.save(); // Save the profile to the database, it returns a Promise.
      res.json(profile); // Send back profile in HTTP response.
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error"); // General purpose server error, never disclose any sensitive information here.
    }
  }
);

// @route  GET api/profile
// @desc   Get all profiles
// @access Public (User doesn't has to be logged in)
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]); // Populate name and avatar from User model.
    res.json(profiles); // Send back profiles in HTTP response.
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error"); // General purpose server error, never disclose any sensitive information here.
  }
});

// @route  GET api/profile/user/:user_id ":user_id" is a placeholder
// @desc   Get profile by user ID
// @access Public (User doesn't has to be logged in)
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id, // Find user by ID (fetched from URL).
    }).populate("user", ["name", "avatar"]); // Populate name and avatar from User model.

    // Check if there is no profile for this "user_id".
    if (!profile) return res.status(400).json({ msg: "Profile not found" });

    res.json(profile); // Send back profile in HTTP response.
  } catch (err) {
    console.error(err.message);

    // Check if the error is a valid object ID to display the same error message for URL's with valid and invalid object ID.
    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" }); // 400 = Bad Request Error.
    }

    res.status(500).send("Server Error"); // General purpose server error, never disclose any sensitive information here.
  }
});

// @route  DELETE api/profile
// @desc   Delete profile, user & posts
// @access Private (User has to be logged in)
// Middleware is being added as a second parameter always. Whatever route we want to protect, just add "auth" as a second parameter.
router.delete("/", auth, async (req, res) => {
  try {
    await Post.deleteMany({ user: req.user.id }); // Remove User's posts by ID based on the token. "req.user.id" matches the user which is logged in.
    await Profile.findOneAndRemove({ user: req.user.id }); // Remove Profile by ID based on the token. "req.user.id" matches the user which is logged in.
    await User.findOneAndRemove({ _id: req.user.id }); // Remove User by ID based on the token. "req.user.id" matches the user which is logged in.

    res.json({ msg: "User deleted" }); // Send back message in HTTP response.
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error"); // General purpose server error, never disclose any sensitive information here.
  }
});

// @route  PUT api/profile/experience
// @desc   Add Profile experience
// @access Private (User has to be logged in)
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
      return res.status(400).json({ errors: errors.array() }); // Error occured (400 = Bad Request Error), therefore display the error.
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
      const profile = await Profile.findOne({ user: req.user.id }); // Get user by ID from the token. "req.user.id" matches the user which is logged in.

      profile.experience.unshift(newExp); // "unshift()" works like "push()", just it pushes the element to the beginning on an array.

      await profile.save(); // Save the profile to the database, it returns a Promise.
      res.json(profile); // Send back profile in HTTP response.
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error"); // General purpose server error, never disclose any sensitive information here.
    }
  }
);

// @route  DELETE api/profile/experience/:exp_id ":exp_id" is a placeholder
// @desc   Delete experience from Profile
// @access Private (User has to be logged in)
// Middleware is being added as a second parameter always. Whatever route we want to protect, just add "auth" as a second parameter.
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }); // Get user by ID from the token. "req.user.id" matches the user which is logged in.

    // Get experience to be removed by index.
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id); // Find experience by ID (fetched from URL).

    profile.experience.splice(removeIndex, 1); // Take out the desired experience to be removed.

    await profile.save(); // Save the profile to the database, it returns a Promise.
    res.json(profile); // Send back profile in HTTP response.
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error"); // General purpose server error, never disclose any sensitive information here.
  }
});

// @route  PUT api/profile/education
// @desc   Add Profile education
// @access Private (User has to be logged in)
// Middleware is being added as a second parameter always. Because validation and auth middleware must be used together, pass this as an array.
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of study is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // Check for errors.
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Error occured (400 = Bad Request Error), therefore display the error.
    }

    // Pull that details out from "req.body".
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    // Create object with data that the user submits.
    const newEdu = {
      school, // Equivalent to "school:school"
      degree, // Equivalent to "degree:degree" etc...
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id }); // Get user by ID from the token.

      profile.education.unshift(newEdu); // "unshift()" works like "push()", just it pushes the element to the beginning on an array.

      await profile.save(); // Save the profile to the database, it returns a Promise.
      res.json(profile); // Send back profile in HTTP response.
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error"); // General purpose server error, never disclose any sensitive information here.
    }
  }
);

// @route  DELETE api/profile/education/:exp_id ":exp_id" is a placeholder
// @desc   Delete education from Profile
// @access Private (User has to be logged in)
// Middleware is being added as a second parameter always. Whatever route we want to protect, just add "auth" as a second parameter.
router.delete("/education/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }); // Get user by ID from the token. "req.user.id" matches the user which is logged in.

    // Get education to be removed by index.
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.exp_id); // Find experience by ID (fetched from URL).

    profile.education.splice(removeIndex, 1); //Take out the desired education to be removed.

    await profile.save(); // Save the profile to the database, it returns a Promise.
    res.json(profile); // Send back profile in HTTP response.
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error"); // General purpose server error, never disclose any sensitive information here.
  }
});

// @route  GET api/profile/github/:username ":username" is a placeholder
// @desc   Get user repositories from GitHub
// @access Public (User doesn't has to be logged in)
router.get("/github/:username", (req, res) => {
  try {
    // Set options for fetching user's GitHub repositories.
    const options = {
      headers: { "user-agent": "node.js" },
      method: "GET",
      uri: `https://api.github.com/users/${
        req.params.username // Find username by ID (fetched from URL).
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
    };

    request(options, (error, response, body) => {
      if (error) console.error(error); // Console log any errors.

      // Check for non successful HTTP status codes.
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No GitHub profile found" }); // Status code is different than "200" ("OK"), then display "404" ("Not Found") status.
      }

      res.json(JSON.parse(body)); // Parse string - in which form the "body" is, to JSON.
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error"); // General purpose server error, never disclose any sensitive information here.
  }
});

module.exports = router;
