const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Shorthand of "mongoose.Schema" to be a bit cleaner.

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId, // The ObjectId is an unique object for every new user starting from "_" which can be seen in the MongoDB Atlas.
    ref: "users", // Connect 'users' to post, so they can delete, edit only their own posts etc. It also shows (based on gravatar) which user has created each post.
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  // Make sure that each user can give only 1 like.
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId, // The ObjectId is an unique object for every new user starting from "_" which can be seen in the MongoDB Atlas.
        ref: "users", // That way we know which like came from which user.
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId, // The ObjectId is an unique object for every new user starting from "_" which can be seen in the MongoDB Atlas.
        ref: "users", // That way we know which like came from which user.
      },
      text: String,
      required: true,
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now, // Default date set as current one.
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now, // Default date set as current one.
  },
});

module.exports = Post = mongoose.model("post", PostSchema); // Export variable "Post" and set it to "mongoose.model("post", PostSchema)".
