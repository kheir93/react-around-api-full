const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { celebrate, Joi } = require('celebrate');

router.get('/cards', getCards);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  })
}), createCard);
router.put('/cards/likes/:cardId', likeCard);
router.delete('/cards/:cardId', deleteCard);
router.delete('/cards/likes/:cardId', dislikeCard);

module.exports = router;
