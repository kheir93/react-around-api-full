const Card = require('../models/cards');

const OK = 200;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(OK).send( cards ))
    .catch((err) => res.status(SERVER_ERROR).send(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body
  const owner = req.user._id;
  Card.create( name, link, owner )
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send(err);
      } else {
        res.status(SERVER_ERROR).send({ message: 'An internal error has occured' });
      }
      return next(err);
    });
};

const deleteCard = (req, res) => {
  // const { cardId } = req.params;
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      const error = new Error('No card found with that id');
      error.statusCode = NOT_FOUND;
      throw error; // Remember to throw an error so .catch handles it instead of .then
    })
    .then((card) => {
      if (!card.ower === (req.user._id)) {
        return Promise.reject(new Error('Not your card'));
      }
      Card.deleteOne(card).then(() => res.status(OK).send({ data: card }))
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Bad request' });
      } if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: 'An internal error has occured' });
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => res.status(OK).send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Bad request' });
    } if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).send({ message: err.message });
    }
    return next(err);
  });
}

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => res.status(OK).send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Bad request' });
    } if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).send({ message: err.message });
    }
    return res.status(SERVER_ERROR).send({ message: 'An internal error has occured' });
  });
}

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
