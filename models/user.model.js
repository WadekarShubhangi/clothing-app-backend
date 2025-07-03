const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: String,
  addresses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address"
    }
  ],
},{ timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
