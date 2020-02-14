const connectDB = require("./config/db");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); // Connect database.

app.get("/", (req, res) => res.send("API Running"));
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
