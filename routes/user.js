const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const controllers = require('../controllers/users');

router.route('/register')
    .get(controllers.renderRegister)
    .post(catchAsync(controllers.register));

router.route('/login')
    .get(controllers.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), controllers.afterLogin);

router.get('/logout', controllers.logout);

module.exports = router;