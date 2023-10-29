// detailModel.js
const mongoose = require('mongoose');
const Schedule = require('../db/schedule');

const detailSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  _idProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product' // Tham chiếu đến mô hình Product
  },
  name: String,
  description: {
    facilities: String,
    prices: String,
    transportation: String,
  },
  schedules: [Schedule.schema], // Mảng lưu trữ lịch sân cho từng ngày trong tháng
});

const Detail = mongoose.model('Detail', detailSchema);

module.exports = Detail;
