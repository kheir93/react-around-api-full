const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', createCard);
router.put('/cards/likes/:cardId', likeCard);
router.delete('/cards/:cardId', deleteCard);
router.delete('/cards/likes/:cardId', dislikeCard);

module.exports = router;
