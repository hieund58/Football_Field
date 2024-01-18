// paypalConfig.js
const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: 'sandbox', // 'sandbox' hoặc 'live' tùy thuộc vào môi trường
  client_id: 'AZVrnOh3W54OTZnnRhjbqGaV-YEUKJQzKtd4VcG5kDVQmqpxzlk7D_oWC52qsMIOyJFAlFZwh_vPKBJL',
  client_secret: 'YOUR_PAYPAL_CLIENT_SECRET',
});

module.exports = paypal;
