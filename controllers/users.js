const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError404 = require('../errors/NotFoundError404');
const BadRequestError400 = require('../errors/BadRequestError400');
const ConflictError409 = require('../errors/ConflictError409');

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then(() => {
      res.status(201).send({
        data: {
          email, name,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError400(`Проверьте введенные данные. Ошибка - ${err.message}`));
      } else if (err.code === 11000) {
        next(new ConflictError409('Пользователь с таким Email уже зарегистрирован. Попробуйте другой Email.'));
      } else {
        next(err);
      }
    });
};

module.exports.patchUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError404('Пользователь с указанным _id не найден');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError400(`Проверьте введенные данные. Ошибка - ${err.message}`));
      } else if (err.name === 11000) {
        next(new ConflictError409('Такой пользователь уже существует.'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError404('Пользователь с указанным _id не найден');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
