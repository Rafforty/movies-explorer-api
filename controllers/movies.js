const Movie = require('../models/movie');
const NotFoundError404 = require('../errors/NotFoundError404');
const BadRequestError400 = require('../errors/BadRequestError400');
const ForbiddenError403 = require('../errors/ForbiddenError403');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.postMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError400(`Проверьте введенные данные. Ошибка - ${err.message}`));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => new NotFoundError404('Фильм с указанным _id не найден.'))
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        return movie.remove()
          .then(() => res.send(movie));
      }
      return next(new ForbiddenError403('Невозможно удалить чужой фильм.'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError400(`Проверьте введенные данные. Ошибка - ${err.message}`));
      } else {
        next(err);
      }
    });
};
