const Card = require('../models/card');

const UNCORRECT_DATA_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(UNCORRECT_DATA_ERROR_CODE).send({ message: 'Ошибка получения карточек' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(UNCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NoValidid'))
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.message === 'NoValidid') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return err.name === 'CastError'
        ? res.status(UNCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные' })
        : res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка удаления карточки' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NoValidid'))
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.message === 'NoValidid') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return err.name === 'ValidationError' || err.name === 'CastError'
        ? res.status(UNCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' })
        : res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка удаления карточки' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NoValidid'))
    .catch((err) => {
      if (err.message === 'NoValidid') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return err.name === 'ValidationError' || err.name === 'CastError'
        ? res.status(UNCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' })
        : res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка удаления карточки' });
    });
};
