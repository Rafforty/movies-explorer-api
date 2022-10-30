const router = require('express').Router();

const { validationUser } = require('../middlewares/validation');

const { patchUser, getUserInfo } = require('../controllers/users');

router.get('/me', getUserInfo);
router.patch('/me', validationUser, patchUser);

module.exports = router;
