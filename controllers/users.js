const User = require("../models/user");

const UNCORRECT_DATA_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      return err.name === "ValidationError"
        ? res
            .status(UNCORRECT_DATA_ERROR_CODE)
            .send({ message: "Ошибка получения пользователей" })
        : res
            .status(DEFAULT_ERROR_CODE)
            .send({ message: "Ошибка по умолчанию" });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      return err.name === "CastError"
        ? res
            .status(NOT_FOUND_ERROR_CODE)
            .send({ message: "Пользователь по указанному _id не найден." })
        : res
            .status(DEFAULT_ERROR_CODE)
            .send({ message: "Произошла ошибка удаления карточки" });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      return err.name === "ValidationError"
        ? res
            .status(UNCORRECT_DATA_ERROR_CODE)
            .send({
              message: "Переданы некорректные данные при создании пользователя",
            })
        : res
            .status(DEFAULT_ERROR_CODE)
            .send({ message: "Ошибка по умолчанию" });
    });
};

module.exports.updateUserData = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name: name, about: about },
    {
      new: true,
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(UNCORRECT_DATA_ERROR_CODE)
          .send({
            message: "Переданы некорректные данные при обновлении профиля",
          });
      } else if (err.name === "CastError") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Пользователь с указанным _id не найден" });
      } else {
        return res
          .status(DEFAULT_ERROR_CODE)
          .send({ message: "Ошибка по умолчанию" });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar: avatar },
    {
      new: true,
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(UNCORRECT_DATA_ERROR_CODE)
          .send({
            message: "Переданы некорректные данные при обновлении аватара",
          });
      } else if (err.name === "CastError") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Пользователь с указанным _id не найден" });
      } else {
        return res
          .status(DEFAULT_ERROR_CODE)
          .send({ message: "Ошибка по умолчанию" });
      }
    });
};
