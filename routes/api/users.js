const bcrypt = require("bcryptjs");
const config = require("config");
const express = require("express");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body; // Extract needed data from the HTTP request.

    try {
      let user = await User.findOne({ email }); // It returns a Promise.

      // See if user exists.
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists " }] });
      }

      // Get users gravatar.
      const avatar = gravatar.url(email, {
        s: "200", // Size in pixels for single pixel dimension, since the images are squares.
        r: "pg", // Rating (see: https://en.gravatar.com/site/implement/images/ and then "Rating").
        d: "mm" // Set up a sample default image.
      });

      // Create new instance of a user (it doesn't saves the user to database yet).
      user = new User({
        name,
        email,
        avatar,
        password
      });

      // Encrypt and save password.
      const salt = await bcrypt.genSalt(10); // Password hashing settings aka. "salt", use recommended 10 rounds, it returns a Promise.
      user.password = await bcrypt.hash(password, salt); // Hash password.

      await user.save(); // Save user to the database, it returns a Promise.

      // Get payload in a form of JSON Web Token (JWT) which includes the user ID in order to be logged in right away after registration.
      const payload = {
        user: {
          id: user.id
        }
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
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
