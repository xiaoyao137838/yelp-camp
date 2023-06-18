const { campgroundSchema, reviewSchema } = require("./joiSchema");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");
const catchAsync = require("./utils/catchAsync");

const campgroundValidate = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const reviewValidate = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Please login first");
    res.redirect("/login");
  } else {
    next();
  }
};

const isExistingCamp = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (!camp) {
    req.flash("error", "This campground does not exist");
    res.redirect("/campgrounds");
  } else {
    req.session.camp = camp;
    next();
  }
});

const isAuthorizedCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = req.session.camp;
  if (campground.author.equals(req.user._id)) {
    next();
  } else {
    req.flash("error", "You are not authorized to do this");
    res.redirect(`/campgrounds/${id}`);
  }
};

const isExisitingReview = catchAsync(async (req, res, next) => {
  const { id, reviewId } = req.params;
  const camp = await Campground.findById(id);
  const review = await Review.findById(reviewId);

  if (camp && review && camp.reviews.includes(reviewId)) {
    next();
  } else {
    req.flash("error", "This review does not exist");
    res.redirect(`/campgrounds/${id}`);
  }
});

const isAuthorizedReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (review.author.equals(req.user._id)) {
    next();
  } else {
    req.flash("error", "You are not authorized to do this");
    res.redirect(`/campgrounds/${id}`);
  }
};

module.exports = {
  campgroundValidate,
  reviewValidate,
  isLoggedIn,
  isAuthorizedCampground,
  isAuthorizedReview,
  isExistingCamp,
  isExisitingReview,
};
