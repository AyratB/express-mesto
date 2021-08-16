const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config();

const UNAUTHORIZED_ERROR_CODE = 401;
const FORBIDDEN_ERROR_CODE = 403;

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (jwt) {
    let payload;

    try {
      payload = jsonwebtoken.verify(jwt, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(UNAUTHORIZED_ERROR_CODE)
        .send({ message: 'Некорректный JWT-токен' });
    }

    req.user = payload;

    next();
  }

  return res
    .status(FORBIDDEN_ERROR_CODE)
    .send({ message: 'Доступ запрещен. Необходима авторизация' });
};
