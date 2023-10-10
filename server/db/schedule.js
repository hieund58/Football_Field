// models/Schedule.js
const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, required: true },
});

module.exports = mongoose.model('Schedule', scheduleSchema);
