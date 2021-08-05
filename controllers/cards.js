const Card = require("../models/card");

const UNCORRECT_DATA_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) =>
    {
      return err.name === 'ValidationError'
        ? res.status(UNCORRECT_DATA_ERROR_CODE).send({ message: "Ошибка получения карточек" })
        : res.status(DEFAULT_ERROR_CODE).send({ message: "Ошибка по умолчанию" });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) =>
    {
      return err.name === 'ValidationError'
        ? res.status(UNCORRECT_DATA_ERROR_CODE).send({ message: "Переданы некорректные данные при создании карточки" })
        : res.status(DEFAULT_ERROR_CODE).send({ message: "Ошибка по умолчанию" });
    });
};

module.exports.deleteCard = (req, res) => {

  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) =>
    {
      return err.name === 'CastError'
        ? res.status(NOT_FOUND_ERROR_CODE).send({ message: "Карточка с указанным _id не найдена" })
        : res.status(DEFAULT_ERROR_CODE).send({ message: "Произошла ошибка удаления карточки" });
    });
};

module.exports.likeCard = (req, res) =>{
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) =>
    {
      return err.name === 'ValidationError'
        ? res.status(UNCORRECT_DATA_ERROR_CODE).send({ message: "Переданы некорректные данные для постановки/снятии лайка" })
        : res.status(DEFAULT_ERROR_CODE).send({ message: "Ошибка по умолчанию" });
    });
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .catch((err) =>
    {
      return err.name === 'ValidationError'
        ? res.status(UNCORRECT_DATA_ERROR_CODE).send({ message: "Переданы некорректные данные для постановки/снятии лайка" })
        : res.status(DEFAULT_ERROR_CODE).send({ message: "Ошибка по умолчанию" });
    });
}