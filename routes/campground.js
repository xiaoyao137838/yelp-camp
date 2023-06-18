const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { campgroundValidate, isLoggedIn, isAuthorizedCampground, isExistingCamp } = require('../middleware');
const controllers = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.get('/new', isLoggedIn, controllers.renderNew);

router.route('/')
    .get(catchAsync(controllers.index))
    .post(isLoggedIn, upload.array('image'), campgroundValidate, catchAsync(controllers.createCamp));

router.route('/:id')
    .get(isExistingCamp, catchAsync(controllers.showCamp))
    .put(isLoggedIn, isExistingCamp, isAuthorizedCampground, upload.array('image'), campgroundValidate, catchAsync(controllers.updateCamp))
    .delete(isLoggedIn, isExistingCamp, isAuthorizedCampground, catchAsync(controllers.deleteCamp));

router.get('/:id/edit', isLoggedIn, isExistingCamp, isAuthorizedCampground, catchAsync(controllers.renderEdit));

module.exports = router;