const Card = require('../models/cards');

const OK = 200;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

const getCards = (req, res) => {
  Card.find({})
    .then((users) => res.status(OK).send(users))
    .catch((err) => res.status(SERVER_ERROR).send(err));
};

const createCard = (req, res) => {
  console.log(req.user._id);
  Card.create({ ...req.body })
    .then((data) => {
      res.status(OK).send({ data });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send(err);
      } else {
        res.status(SERVER_ERROR).send({ message: 'An internal error has occured' });
      }
    });
};

const deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id)
    .orFail(() => {
      const error = new Error('No card found with that id');
      error.statusCode = NOT_FOUND;
      throw error; // Remember to throw an error so .catch handles it instead of .then
    })
    .then((data) => res.status(OK).send({ data }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Bad request' });
      } if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: 'An internal error has occured' });
    });
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((data) => res.status(OK).send({ data }))
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Bad request' });
    } if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).send({ message: err.message });
    }
    return res.status(SERVER_ERROR).send({ message: 'An internal error has occured' });
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((data) => res.status(OK).send({ data }))
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Bad request' });
    } if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).send({ message: err.message });
    }
    return res.status(SERVER_ERROR).send({ message: 'An internal error has occured' });
  });

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
