const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const errorMiddleware = require('../middlewares/errorMiddleware');
const { NODE_ENV, JWT_SECRET } = process.env;

const randomString = crypto
  .randomBytes(16)
  .toString('hex');

// console.log(randomString);

const OK = 200;
const BAD_REQUEST = 400;
const BAD_METHOD = 401;
const NOT_FOUND = 404;
const CONFLICT = 409;
const SERVER_ERROR = 500;

const getUsers = (req, res, next) => {
  User.find({})
    .orFail(() => {
      throw new errorMiddleware('User with this ID was found', NOT_FOUND)
    })
    .then((users) => res.status(OK).send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  let id = new mongoose.Types.ObjectId(req.params.id);
  User.findById(id)
      .orFail(() => {
        throw new errorMiddleware('User with this ID was found', NOT_FOUND)
      })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new errorMiddleware('Bad request', BAD_REQUEST));
      } if (err.statusCode === NOT_FOUND) {
        return next(new errorMiddleware('Not found', NOT_FOUND));
      }
      return next(new errorMiddleware('An internal error has occured', SERVER_ERROR));
    });
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new errorMiddleware('User with this ID was found', NOT_FOUND)
    })
    .then((user) => { res.status(OK).send({user}); })
    .catch(next)
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return next(new errorMiddleware('User already exists', CONFLICT));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          res.status(OK).send({ _id: user._id, email: user.email })
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return next(new errorMiddleware('Bad request', BAD_REQUEST));
        } else {
          next(new errorMiddleware('An internal error has occured', SERVER_ERROR));
        }
        return next(err);
      });
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) { return next(new errorMiddleware('User doesn\'t exists', NOT_FOUND)); }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-testing',
        {
          expiresIn: '7d',
        },
      );
      res.send({ data: user.toJSON(), token });
    })
    .catch(() => {
        return next(new errorMiddleware('Bad credentials', BAD_METHOD));
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true
    },
  )
    .then((user) => {
      res.status(OK).send({ data: user })
    }
  )
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new errorMiddleware('Bad request', BAD_REQUEST));
      } else {
        return next(new errorMiddleware('An internal error has occured', SERVER_ERROR));
      }
    })
    .catch(next)
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true
    }
  )
    .then((data) => res.status(OK).send({ data }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new errorMiddleware('Bad request', BAD_REQUEST));
      } else {
        next(new errorMiddleware('An internal error has occured', SERVER_ERROR));
      }
      return next(err);
    })
    .catch(next);
};

module.exports = {
  getUsers, getUserById, createUser, updateUser, updateAvatar, login, getUser
};
