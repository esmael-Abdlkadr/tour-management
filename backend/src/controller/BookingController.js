const Booking = require("../model/bookingModel");
const Tour = require("../model/tourModel");
const asyncHandler = require("../util/asyncHandler");
const AppError = require("../util/appError");
const sendEmail = require("../util/email");
const factory = require("./handlerFactory");
const logActivity = require("../util/logActivity");
exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
exports.deleteAllBookings = factory.deleteAll(Booking);
exports.createBooking = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  const user = req.user;
  const currentDate = new Date();
  const tourId = req.params.id;
  const userId = user._id;

  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }
  // check if tour has already started or not.
  if (tour.startDate < currentDate) {
    return next(new AppError("this  tour has already started", 400));
  }
  // Check if the user has already booked the tour.
  const hasBooked = await Booking.findOne({
    tour: tourId,
    user: userId,
    status: { $in: ["confirmed"] },
  });
  if (hasBooked) {
    return next(
      new AppError(
        "You have already booked this tour or your previous booking is still being processed",
        400
      )
    );
  }
  if (tour.availability <= 0) {
    return next(
      new AppError("No seats available,This tour is fully booked", 400)
    );
  }
  tour.availability -= 1;
  // create-booking
  const booking = await Booking.create({
    tour: tourId,
    user: userId,
    price: tour.price,
    bookedAt: currentDate,
  });
  const populatedBooking = await Booking.findById(booking._id)
    .populate({ path: "tour", select: "name -_id" })
    .populate({ path: "user", select: "name email -_id" });
  await tour.save();
  // log activity.
  logActivity(userId, `created new booking for  tour: ${tourId}`);
  // send  email.
  const data = {
    user: { name: user.name, email: user.email },
    tour: {
      name: tour.name,
      startDate: tour.startDate,
      endDate: tour.endDate,
      duration: tour.duration,
      price: tour.price,
    },
    supportEmail: "support@destatouring.com",
  };
  await sendEmail({ email: user.email, template: "bookTour.ejs", data });
  res.status(200).json({
    status: "success",
    data: populatedBooking,
  });
});
// booking cancellation.
exports.cancelBooking = asyncHandler(async (req, res, next) => {
  try {
    const user = req.user;
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    const tourId = booking?.tour._id;
    const tour = await Tour.findById(tourId);
    if (!booking) {
      return next(new AppError("Booking not found"));
    }
    // Check cancellation policy (example: 48 hours before the booked date)
    const cancellationDeadline = new Date(
      booking.bookedAt.getTime() - 2 * 24 * 60 * 60 * 1000
    );
    // check if cancellation deadline is passed.
    // if (new Date() > cancellationDeadline) {
    //   return next(new AppError("It is too late to cancel this booking"));
    // }
    // update booking status   to  "cancelled".
    booking.status = "cancelled";
    // cancele booking.
    await booking.save();
    // log activity.
    logActivity(user?._id, `booking  is cancelled  for tour:${tourId}`);
    // send  email.
    const data = {
      user: { name: user.name, email: user.email },
      tour: {
        name: tour.name,
        startDate: tour.startDate,
        endDate: tour.endDate,
        duration: tour.duration,
        price: tour.price,
      },
      supportEmail: "support@destatouring.com",
    };
    await sendEmail({
      email: user.email,
      template: "canceleBooking.ejs",
      data,
    });
    res.status(200).json({
      status: "sucess",
      message: "booking cancelled successfully",
    });
  } catch (err) {
    console.log(err);
  }
});

// my-tours.
exports.myTours = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const bookings = await Booking.find({ user: user._id })
    .select("-user")

    .sort({ bookedAt: -1 });
  res.status(200).json({
    status: "success",
    result: bookings.length,
    data: bookings,
  });
});
