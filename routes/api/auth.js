// Whenever Mongoose's methods are being used we need to use await, because it returns a Promise.
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const config = require("config");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");

// @route   GET api/auth
// @desc    Test route
// @access  Public (User doesn't has to be logged in)
// Middleware is being added as second parameter always. Whatever route we want to protect, just add "auth" as a second parameter.
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // We can access it here (in protected route), because the middleware does the job for us to make it accessible. "-password" means don't return/send back (hashed) password.
    res.json(user); // Send a user in HTTP response.
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error"); // General purpose server error, never disclose any sensitive information here.
  }
});

// @route   POST api/auth
// @desc    Authenticate user and get token
// @access  Public (User doesn't has to be logged in)
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // 400 = Bad Request Error.
    }

    const { email, password } = req.body; // Extract needed data from the HTTP request.

    try {
      let user = await User.findOne({ email }); // It returns a Promise.

      // See if user exists.
      if (!user) {
        return res
          .status(400) // 400 = Bad Request Error.
          .json({ errors: [{ msg: "Invalid credentials" }] }); // For security reasons keep this message same as for a case when password doesn't match.
      }

      // Compare plaintext password ("password") and encrypted password which we can get from the user ("user.password").
      const isMatch = await bcrypt.compare(password, user.password);

      // See if passwords matches.
      if (!isMatch) {
        return res
          .status(400) // 400 = Bad Request Error.
          .json({ errors: [{ msg: "Invalid credentials" }] }); // For security reasons keep this message same as for a case when user doesn't exists.
      }

      // Get payload in a form of JSON Web Token (JWT) which includes the user ID in order to be logged in right away after registration.
      const payload = {
        user: {
          id: user.id,
        },
      };

      // Asynchronous sign of a token, pass a payload and secret, with default HMAC SHA256 and expiration in 1 hour. On callback throw an error or send a token.
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err; // Throw an error.
          res.json({ token }); // Send a token in HTTP response to the client.
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error"); // General purpose server error, never disclose any sensitive information here.
    }
  }
);

module.exports = router;
