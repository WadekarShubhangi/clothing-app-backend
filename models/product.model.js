const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: String,
    brand: String,
    description: String,
    image: String,
    rating: Number,
    totalRating: Number,
    originalPrice: Number,
    discountedPrice: Number,
    discount: String,
    stock: Number,
    size: {
      type: [String],
      required: true,
    },
    colour: [String],
    tags: [{ type: String }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
