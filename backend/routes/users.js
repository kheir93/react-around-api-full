const router = require('express').Router();
const {
  getUsers, getUserById, createUser, updateUser, updateAvatar, login, getUser
} = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().required().min(4),
  })
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().required().min(4),
  })
}), createUser);
router.use(auth);

router.get('/users/me', getUser);
router.get('/users/', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  })
}), updateUser);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  })
}), updateAvatar);

module.exports = router;
