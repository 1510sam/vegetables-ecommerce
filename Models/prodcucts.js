const mongoose = require("mongoose");
const prodcutScheme = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sales: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  image1: {
    type: String,
    required: false,
  },
  image2: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.ObjectId,
    ref: "Category",
    require:true
  },
});

module.exports = mongoose.model("Product", prodcutScheme);
