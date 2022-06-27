const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const urlRegex = /^(?:http(s)?:\/\/)|^(?:www\.)/gi;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Kheireddine Allal'
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Aspirant Web-Developer'
  },
  avatar: {
    type: String,
    required: true,
    match: urlRegex,
    validate:
     { validator: (v) => validator.isURL(v),
      message: 'Must be a Valid URL',
    },
    default: 'https://images.unsplash.com/photo-1590138195930-7eb34a581384?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Must be a Valid email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Incorrect email or password'));
          }
          return user; // now user is available
        });
    });
};

module.exports = mongoose.model('user', userSchema);
