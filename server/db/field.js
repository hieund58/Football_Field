const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  name: String,
  address: String,
  area: String,
  price: Number,
  playerNum: Number,
  avatarSrc: String,
  detailImgSrc: String,
  description: {
    facilities: String,
    transportation: String,
  },
});

const Field = mongoose.model('Field', fieldSchema);

module.exports = Field;
