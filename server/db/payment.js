const mongoose = require('mongoose');
const timeZone = require("mongoose-timezone");

const paymentSchema = new mongoose.Schema({
//   name: String,
//  people: String,
//   address:String,
//   username: String,
//   sanId: String,
//   selectDate: String,
//   selectTime: String,
  paymentId: String,
  paymentMethod: String,
  fromUser: String,
  type: String, // booking or purchase
  bookingData: {
    fieldId: String,
    scheduleDate: Date,
    scheduleSlotHour: String
  },
  purchaseData: {
    productId: String,
    amount: String
  },
  price: String,
  status: String, // pending, error or paid
});

// paymentSchema.plugin(timeZone);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
