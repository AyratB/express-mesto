const validator = require('validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const UNCORRECT_DATA_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(UNCORRECT_DATA_ERROR_CODE)
          .send({ message: 'Ошибка получения пользователей' });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NoValidid'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NoValidid') {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return err.name === 'CastError'
        ? res
          .status(UNCORRECT_DATA_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные' })
        : res
          .status(DEFAULT_ERROR_CODE)
          .send({ message: 'Произошла ошибка удаления карточки' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (validator.isEmail(email)) {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }))
      .then((user) => res.status(200).send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return res.status(UNCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
        }
        return res
          .status(DEFAULT_ERROR_CODE)
          .send({ message: 'Ошибка по умолчанию' });
      });
  }

  return res
    .status(DEFAULT_ERROR_CODE)
    .send({ message: 'Некорректный формат переданного email' });
};

module.exports.updateUserData = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new Error('NoValidid'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NoValidid') {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Пользователь с указанным _id не найден' });
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(UNCORRECT_DATA_ERROR_CODE).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new Error('NoValidid'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NoValidid') {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Пользователь с указанным _id не найден' });
      }
      if (err.mesage === 'ValidationError' || err.name === 'CastError') {
        return res.status(UNCORRECT_DATA_ERROR_CODE).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: 'Ошибка по умолчанию' });
    });
};
