const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }); // 'mongoose.connect()' returns a promise, therefore 'await' should be used.

    console.log("MongoDB connected...");
  } catch (err) {
    console.log(err.message);

    process.exit(1); // Exit process with failure.
  }
};

module.exports = connectDB;
