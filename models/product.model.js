const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    brand: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRating: { type: Number, default: 0 },
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    discount: { type: String },
    stock: Number,
    size: { type: [String], required: true },
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
