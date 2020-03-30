const connectDB = require("./config/db");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); // Connect database.

app.use(express.json()); // Initialize middleware.

app.get("/", (req, res) => res.send("API Running"));

// Define routes.
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/users", require("./routes/api/users"));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
