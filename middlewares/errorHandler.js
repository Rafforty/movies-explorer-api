function errorHandler(err, req, res, next) {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Произошла ошибка сервера' : message });
  next();
}

module.exports = errorHandler;
