const Tour = require("../model/tourModel");
const factory = require("./handlerFactory");
const asyncHandler = require("../util/asyncHandler");
exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.createTour = factory.createOne(Tour);
exports.BookTour = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }
  if (tour.maxGroupSize <= tour.bookedUsers.length) {
    return next(new AppError("Tour is fully booked", 400));
  }
  if (tour.bookedUsers.includes(req.user.id)) {
    return next(new AppError("You have already booked this tour", 400));
  }
  tour.bookedUsers.push(req.user.id);
  await tour.save();
  res.status(200).json({
    status: "success",
    data: tour,
  });
});
// list of tours booked by user
exports.myTours = asyncHandler(async (req, res, next) => {
  const tours = await Tour.find({ bookedUsers: req.user.id });
  res.status(200).json({
    status: "success",
    data: tours,
  });
});
