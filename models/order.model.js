const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    totalAmount: Number,
    status: {
      type: String,
      enum : ["Processing", "Shipped", "Delivered"],
      default: "Processing",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
