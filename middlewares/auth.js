const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config();

const UnauthorizedError = require('../errors/unauthorized_err');
const ForbiddenError = require('../errors/forbidden_err');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (jwt) {
    let payload;

    try {
      payload = jsonwebtoken.verify(jwt, process.env.JWT_SECRET);
    } catch (err) {
      next(new UnauthorizedError('Некорректный JWT-токен'));
    }

    req.user = payload;

    next();
  } else {
    next(new ForbiddenError('Доступ запрещен. Необходима авторизация'));
  }
};
