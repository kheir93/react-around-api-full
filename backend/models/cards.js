const mongoose = require('mongoose');
const validator = require('validator');

const urlRegex = /^(?:http(s)?:\/\/)|^(?:www\.)/gi;

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      match: urlRegex,
      message: 'Must be a Valid URL',
    },
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
  },
  likes: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('cards', cardSchema);
