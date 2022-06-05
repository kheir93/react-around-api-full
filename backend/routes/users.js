const router = require('express').Router();
const {
  getUsers, getUserById, createUser, deleteUser, updateUser, updateAvatar, login
} = require('../controllers/users');

router.post('/signup', createUser)
router.post('/signin', login);
router.get('/users/me', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);
router.delete('/users/:id', deleteUser);

module.exports = router;
