// db/detail.js
const mongoose = require('mongoose');

const detailSchema = new mongoose.Schema({
  facilities: [{ type: String }],
  prices: [{ type: String }],
  transportation: [{ type: String }],
});

const Detail = mongoose.model('Detail', detailSchema);

module.exports = Detail;
