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
    select: "name",
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
      await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating,
      });
    } else {
      await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: 0,
        // assume 4.5  is  default rating when there is no review.
        ratingsAverage: 0,
      });
    }
  } catch (err) {
    console.log("error while  calcuate average rating", err);
  }
};
// update average rating after save
ratingSchema.post("save", function () {
  // this => points to the current review document
  this.constructor.calcAverageRatings(this.tour);
});
ratingSchema.post(/^findOneAnd/, async function (doc, next) {
  // doc => points to the current review document
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.tour);
  }
  next();
});
const Rating = model("Rating", ratingSchema);
module.exports = Rating;
