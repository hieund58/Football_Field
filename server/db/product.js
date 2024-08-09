const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: String,
  imageSrc: String,
  type: String, // equipment or clothes or shoe
  price: Number,
  sizes: String,
  colors: String,
  description: String,
  remaining: Number,
});

productSchema.methods.updateRemaining = function (purchasedNum) {
  if (isNaN(parseFloat(purchasedNum))) {
    throw new Error("Purchased number is not a number bruh");
  }
  this.remaining = this.remaining - Number(purchasedNum);
};

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
