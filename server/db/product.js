const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: String,
  imageSrc: String,
  type: String, // equipment or clothes
  price: Number,
  sizes: String,
  colors: String,  
  description: String,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
