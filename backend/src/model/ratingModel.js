const mongoose = require("mongoose");
const Tour = require("./tourModel");
const { Schema, model } = mongoose;
const ratingSchema = new Schema(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Rating must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Rating must belong to a user"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "rating must have rating value"],
    },
    review: {
      type: String,
      trim: true,
      required: [true, "Review can't be empty"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// prevet duplicate rating
ratingSchema.index({ tour: 1, user: 1 }, { unique: true });

ratingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});
// calculate average rating.
ratingSchema.statics.calcAverageRatings = async function (tourId) {
  try {
    const stats = await this.aggregate([
      {
        // step1 :- select all  reviews   corrsponds  to  current document(tour)
        $match: { tour: tourId },
      },
      // 2. calculate the  stats.
      {
        $group: {
          _id: "$tour",
          nRating: { $sum: 1 },
          avgRating: { $avg: "$rating" },
        },
      },
    ]);
    if (stats.length > 0) {
      await this.model("Tour").findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating,
      });
    } else {
      await this.model("Tour").findByIdAndUpdate(tourId, {
        ratingsQuantity: 0,
        // assume 4.5  is  default rating when there is no review.
        ratingsAverage: 4.5,
      });
    }
  } catch (err) {
    console.log("error while  calcuate average rating", err);
  }
};
// update average rating after save
ratingSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.tour);
});
const Rating = model("Rating", ratingSchema);
module.exports = Rating;
