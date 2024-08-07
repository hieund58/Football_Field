const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: String,
  imageSrc: String,
  type: String, // equipment or clothes
  price: Number,
  remaining: Number,  
  description: String,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
