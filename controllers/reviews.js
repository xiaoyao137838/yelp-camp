const Campground = require('../models/campground');
const Review = require('../models/review');

const createReview = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user;
    camp.reviews.push(review);
    await camp.save();
    await review.save();

    req.flash('success', 'Successfully make a new review');
    return res.redirect(`/campgrounds/${id}`);
}

const deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: {reviews: reviewId} });
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Successfully delete the review');
    return res.redirect(`/campgrounds/${id}`);
}

module.exports = { createReview, deleteReview };