const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
