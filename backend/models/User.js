const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
      name: String,
      email: String,
      age: Number,
  
      // Add timestamps for when the document is created and last modified
    },
    { timestamps: true }
  );
  
  // Export the Mongoose model for the user schema, using the name "user"
  module.exports = mongoose.model("user", userSchema);