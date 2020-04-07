const config = require("config");
const jwt = require("jsonwebtoken");

// Since this is a middleware function it'll take request, response and next (callback which we have to run when we're done, so it moves one to the next piece of middleware).
module.exports = function (req, res, next) {
  const token = req.header("x-auth-token"); // Get token from header.

  // Check if there is no token.
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" }); // $01 = Not Authorized.
  }

  // Verify token.
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret")); // Decode token.

    req.user = decoded.user; // Get the user's (profile) from the payload.
    next(); // Callback which we have to run when we're done, so it moves one to the next piece of middleware. It's done in any middleware basically.
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
