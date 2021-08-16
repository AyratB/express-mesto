const Card = require('../models/card');

const UncorrectDataError = require('../errors/uncorrect_data_err');
const NotFoundError = require('../errors/not_found_err');
const DefaultError = require('../errors/default-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => next(err.name === 'ValidationError' ? new UncorrectDataError('Ошибка получения карточек') : new DefaultError('Ошибка по умолчанию')));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => next(err.name === 'ValidationError' ? new UncorrectDataError('Переданы некорректные данные при создании карточки') : new DefaultError('Ошибка по умолчанию')));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .where('owner').equals(req.user._id)
    .orFail(new Error('NoValidid'))
    .then((card) => res.status(200).send({ data: card }))

    .catch((err) => {
      if (err.message === 'NoValidid') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else if (err.message === 'CastError') {
        next(new UncorrectDataError('Переданы некорректные данные'));
      } else {
        next(new DefaultError('Произошла ошибка удаления карточки'));
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NoValidid'))
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.message === 'NoValidid') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else if (err.message === 'CastError') {
        next(new UncorrectDataError('Переданы некорректные данные для постановки лайка'));
      } else {
        next(new DefaultError('Произошла ошибка постановки лайка карточки'));
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NoValidid'))
    .catch((err) => {
      if (err.message === 'NoValidid') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new UncorrectDataError('Переданы некорректные данные для удаления лайка'));
      } else {
        next(new DefaultError('Произошла ошибка постановки удаления лайка карточки'));
      }
    });
};
