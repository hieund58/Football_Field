// schedule.js
const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  date: Date,
  slots: [{
    hour: String,
    status: String,
    court: Number,
    pricess:String,
  }],
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
