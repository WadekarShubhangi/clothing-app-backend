const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  userName: String,
  houseNumber: Number,
  apartment: String,
  city: String,
  state: String,
  postal: Number,
  country: String,
  phoneNumber : Number, 
});

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
