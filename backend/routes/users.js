const router = require('express').Router();
const {
  getUsers, getUserById, createUser, updateUser, updateAvatar, login, getUser
} = require('../controllers/users');

router.post('/signup', createUser)
router.post('/signin', login);

router.get('/users/me', getUser);
router.get('/users/', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
