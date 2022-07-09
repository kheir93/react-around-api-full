const mongoose = require('mongoose');
const validator = require('validator');

const urlRegex = /^(?:http(s)?:\/\/)|^(?:www\.)/gi;

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      match: urlRegex,
      message: 'Must be a Valid URL'
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // ref: 'user'
  },
  likes: {
    type: Array,
    default: [],
    ref: 'user',
    // default: [mongoose.Types.ObjectId]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
