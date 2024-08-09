const mongoose = require('mongoose');
const timeZone = require("mongoose-timezone");

const paymentSchema = new mongoose.Schema({
  paymentId: String,
  paymentMethod: String,
  fromUser: String,
  type: String, // booking or purchase
  bookingData: {
    fieldId: String,
    scheduleDate: Date,
    scheduleSlotHour: String
  },
  purchaseData: [{
    productId: String,
    price: String,
    quantity: String
  }],
  price: String,
  status: String, // pending, error or paid
});

// paymentSchema.plugin(timeZone);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
