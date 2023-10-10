const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  area: String,
  people: String,
  imageSrc: String,
  price: String,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
