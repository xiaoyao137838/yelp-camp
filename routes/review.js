const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthorizedReview, reviewValidate, isExisitingReview} = require('../middleware');
const controllers = require('../controllers/reviews');

router.post('/', isLoggedIn, reviewValidate, catchAsync(controllers.createReview));

router.delete('/:reviewId', isLoggedIn, isExisitingReview, isAuthorizedReview, catchAsync(controllers.deleteReview));

module.exports = router;