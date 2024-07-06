const Review = require("../model/ratingModel");
const Booking = require("../model/bookingModel");
const Rating = require("../model/ratingModel");
const factory = require("./handlerFactory");
const asyncHandler = require("../util/asyncHandler");
const AppError = require("../util/appError");

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
//  create-review.
exports.createReview = asyncHandler(async (req, res, next) => {
  const { tourId, rating, review } = req.body;
  const userId = req.user._id;
  // 1/check if user booked the tour.
  const bookingExist = await Booking.findOne({
    user: userId,
    tour: tourId,
    // status: "confirmed",
  });
  if (!bookingExist) {
    return next(new AppError("You must book this tour before rating it"));
  }
  //   step-2--create the rating.
  const newRating = await Rating.create({
    tour: tourId,
    user: userId,
    rating,
    review,
  });
  //   step-3:-  update average rating.
  await Rating.calcAverageRatings(tourId);
  res.status(200).json({
    status: "sucess",
    data: newRating,
  });
});
