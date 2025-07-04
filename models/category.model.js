const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["Men", "Women", "Boys", "Girls"],
  },
  image: {
    type: String,
    required: true,
  },
},{ timestamps: true });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
