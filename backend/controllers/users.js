const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { NODE_ENV, JWT_SECRET } = process.env;

const randomString = crypto
  .randomBytes(16)
  .toString('hex');

console.log(randomString);

const OK = 200;
const BAD_REQUEST = 400;
const BAD_METHOD = 401;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch((err) => res.status(SERVER_ERROR).send(err));
};

const getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .orFail(() => {
      const error = new Error('No user with that ID was found');
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Bad request' });
      } if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: 'An internal error has occured' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return Promise.reject(new Error('User already exists'));
      }
      return bcrypt.hash(password, 10);
    })
    .then(hash => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Bad Request' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'An internal error has occured' });
      }
    });
}


// const login = (req, res) => {
//   const { email, password } = req.body;
//   User.findOne({ email })
//     .then((user) => {
//       if (!user) {
//         return Promise.reject(new Error('Incorrect email or invalid email'))
//       }
//       return bcrypt.compare(password, user.password);
//     })
//     .then((matched) => {
//       if (!matched) {
//         return Promise.reject(new Error('Incorrect password or invalid email'));
//       }
//       res.send({ message: 'Login successful' });
//     })
//     .catch ((err) => {
//       res
//         .status(401)
//         .send({ message: err.message });
//     });
// };

// const login = (req, res) => {
//   const { email, password } = req.body;

//   return User.findUserByCredentials(email, password)
//     .then((res) => {
//       // authentication successful! user is in the user variable
//       res.send({ message: 'Everything good!' });
//     })
//     .catch((err) => {
//       // authentication error
//       res
//         .status(401)
//         .send({ message: err.message });
//     });
// };

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-testing',
        {
          expiresIn: '7d',
        },
      );
      res.send({ data: user, token });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Bad Request' });
      } else {
        res.status(BAD_METHOD).send({ message: 'Unauthorized' });
      }
    });
};

// const login = (req, res) => {
//   const { email, password } = req.body;

//   User.findOne({ email })
//     .then((user) => {
//       if (!user) {
//         return Promise.reject(new Error('Incorrect password or email'));
//       }
//       return bcrypt.compare(password, user.password);
//     })
//     .then((matched) => {
//       if (!matched) {
//         // the hashes didn't match, rejecting the promise
//         return Promise.reject(new Error('Incorrect password or email'));
//       }
//       // successful authentication
//       res.send({ message: 'Everything good!' });
//     })
//     .catch((err) => {
//       res
//         .status(401)
//         .send({ message: err.message });
//     });
// };

const deleteUser = (req, res) => {
  const { id } = req.params;
  return User.findByIdAndRemove(id)
    .orFail(() => {
      const error = new Error('No user found with that id');
      error.statusCode = NOT_FOUND;
      throw error; // Remember to throw an error so .catch handles it instead of .then
    })
    .then((user) => {
      res.status(OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Bad Request' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'An internal error has occured' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.status(OK).send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Bad Request' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'An internal error has occured' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((data) => res.status(OK).send({ data }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Bad Request' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'An internal error has occured' });
      }
    });
};

module.exports = {
  getUsers, getUserById, createUser, deleteUser, updateUser, updateAvatar, login
};
