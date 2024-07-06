const express = require("express");
const tourController = require("../controller/tourController");
const authController = require("../controller/authController");
const EmailVerification = require("../middleware/requireEamilVerification");
const router = express.Router();
router.route("/search").get(tourController.searchTour);
router.use(authController.protect);
router.route("/").get(tourController.getAllTours);
router.use(EmailVerification.requireEamilVerification);
router.route("/:id").get(tourController.getTour);
router.use(authController.restrcitedTo("admin"));
router
  .route("/")
  .post(tourController.createTour)
  .delete(tourController.deleteAllTours);
router
  .route("/:id")
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
