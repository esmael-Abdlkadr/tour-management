const authController = require("../controller/authController");
const bookingController = require("../controller/BookingController");
const express = require("express");
const router = express.Router();
router.use(authController.protect);
router
  .route("/")

  .get(bookingController.getAllBookings)
  .delete(bookingController.deleteAllBookings);
router
  .route("/:id")
  .post(bookingController.createBooking)
  .get(bookingController.getBooking)
  .patch(bookingController.cancelBooking)
  .delete(bookingController.deleteBooking);
module.exports = router;
