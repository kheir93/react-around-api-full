const errorMiddleware = require('../middlewares/errorMiddleware');
const Card = require('../models/cards');

const OK = 200;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

const getCards = (req, res, next) => {
  Card.find({})
    .orFail(() => {
      throw new errorMiddleware('No card found with thiis id', NOT_FOUND)
    })
    .then((cards) => res.status(OK).send( cards ))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new errorMiddleware('Bad request', BAD_REQUEST));
      } else {
        return next(new errorMiddleware('An internal error has occured', SERVER_ERROR));
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      throw new errorMiddleware('No card found with this id', NOT_FOUND)
    })
    .then((card) => {
      if (!card.ower === req.user._id.toString()) {
        return Promise.reject(new errorMiddleware('Not your card'));
      }
      Card.deleteOne(card).then(() => res.status(OK).send({ data: card }))
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new errorMiddleware('Bad request', BAD_REQUEST));
      }
      return next(new errorMiddleware('An internal error has occured', SERVER_ERROR));
    })
    .catch(next)
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((user) => res.status(OK).send({ data: user }))
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new errorMiddleware('Bad request', BAD_REQUEST))
    }
    return next(new errorMiddleware('An internal error has occured', SERVER_ERROR));
  });
}

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((user) => res.status(OK).send({ data: user }))
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new errorMiddleware('Bad request', BAD_REQUEST))
    }
    return next(new errorMiddleware('An internal error has occured', SERVER_ERROR));
  });
}

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
