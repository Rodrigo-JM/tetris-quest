const router = require('express').Router();
const userRouter = require('./user')

router.use('/users', userRouter)


router.use(function (req, res, next) {
    const err = new Error('Not found.');
    err.status = 404;
    next(err);
  });
  
  module.exports = router