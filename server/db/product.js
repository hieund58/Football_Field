const mongoose = require('mongoose');
// const Schedule = require('../db/schedule');
const productSchema = new mongoose.Schema({
  email:String,
  name: String,
  area: String,
  address: String,
  people: String,
  imageSrc: String,
  price: String,
  totalCourts: Number,  
  description: {
    facilities: String,
    prices: String,
    transportation: String,
  },
 // schedules: [Schedule.schema],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
