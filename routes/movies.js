const router = require('express').Router();

const { getMovies, postMovie, deleteMovie } = require('../controllers/movies');

const { validationMovie, validationMovieDelete } = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', validationMovie, postMovie);
router.delete('/:movieId', validationMovieDelete, deleteMovie);

module.exports = router;
