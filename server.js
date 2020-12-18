const connectDB = require("./config/db");
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); // Connect database.

app.use(express.json()); // Initialize middleware.

// Define routes.
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/users", require("./routes/api/users"));

// Server static assets in production.
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build")); // Set static folder.

  // Handle all other routes than these defined to usage for API purpose.
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html")); // Serve "index.html" file.
  });
}

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
