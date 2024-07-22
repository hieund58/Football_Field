const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  name: String,
 people: String,
  address:String,
  username: String,
  sanId: String,
  selectDate: String,
  selectTime: String,
  price: Number,
  paymentMethod: String,
  status: String,
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
