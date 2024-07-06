const express = require("express");
const reviewController = require("../controller/reviewController");
const authController = require("../controller/authController");
const router = express.Router();
router.use(authController.protect);
router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(reviewController.createReview, authController.restrcitedTo("user"));
router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(reviewController.updateReview, authController.restrcitedTo("admin"))
  .delete(reviewController.deleteReview, authController.restrcitedTo("admin"));

module.exports = router;
