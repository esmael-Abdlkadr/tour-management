const Tour = require("../model/tourModel");
const factory = require("./handlerFactory");
const asyncHandler = require("../util/asyncHandler");
const AppError = require("../util/appError");
exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.createTour = factory.createOne(Tour);
exports.BookTour = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  const currentDate = new Date();
  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }
  // check if tour has already started or not
  if (tour.startDate < currentDate) {
    return next(new AppError("this  tour has already started", 400));
  }
  if (tour.selectedByUsers.includes(req.user.id)) {
    return next(new AppError("You have already booked this tour", 400));
  }
  if (tour.availability <= 0) {
    return next(
      new AppError("No seats available,This tour is fully booked", 400)
    );
  }
  tour.selectedByUsers.push(req.user.id);
  tour.availability = tour.availability - 1;
  await tour.save();
  res.status(200).json({
    status: "success",
    data: tour,
  });
});
// list of tours booked by user
exports.myTours = asyncHandler(async (req, res, next) => {
  // fetch all  tours where the  current user Id  is in the selectedByUser arrays
  const bookedTours = await Tour.find({ selectedByUsers: req.user.id });
  if (bookedTours.length === 0) {
    return next(new AppError("You have not booked any tours yet", 404));
  }

  res.status(200).json({
    status: "success",
    results: bookedTours.length,
    data: bookedTours,
  });
});
