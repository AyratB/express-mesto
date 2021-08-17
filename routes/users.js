const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getUsers, getUser, updateUserData, updateUserAvatar, getCurrentUser,
} = require('../controllers/users');

const isUrl = (value) => {
  if (validator.isURL(value)) {
    return value;
  }
  throw new Error('URL validation err');
};

router.get('/', getUsers);
router.get('/me', getCurrentUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserData);

router.patch('/me/avatar', updateUserAvatar);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(isUrl),
  }),
}), updateUserAvatar);

module.exports = router;
