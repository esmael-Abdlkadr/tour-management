const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const tourSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    availability: {
      type: Number,
      required: [true, "A tour must have a  available spots"],
    },
    startDate: {
      type: Date,
      required: [true, "A tour must have a start date"],
    },
    endDate: {
      type: Date,
      required: [true, "A tour must have a end date"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
      min: [0, "Price must be above 0"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },

    description: {
      type: String,
      trim: true,
    },
    itinerary: {
      type: [String], // Array of strings describing each part of the itinerary
      required: [true, "A tour must have an itinerary"],
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: {
          type: [Number], //[longitude, latitude]
        },
        address: String,
      },
    ],

    images: [String],
  },
  {
    timestamps: true,
  },
);
tourSchema.index({ location: "2dsphere" });
const Tour = model("Tour", tourSchema);
module.exports = Tour;
