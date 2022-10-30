const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const { validationSignIn, validationSignUp } = require('../middlewares/validation');
const NotFoundError404 = require('../errors/NotFoundError404');

router.post('/signin', validationSignIn, login);
router.post('/signup', validationSignUp, createUser);

router.use(auth);

router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);

router.use('*', auth, () => {
  throw new NotFoundError404('Страница не найдена.');
});

module.exports = router;
