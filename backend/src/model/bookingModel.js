const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bookingSchema = new Schema({
  tour: {
    type: Schema.ObjectId,
    ref: "Tour",
    required: [true, "Booking must belong to a tour"],
  },
  user: {
    type: Schema.ObjectId,
    ref: "User",
    required: [true, "Booking must belong to a user"],
  },
  bookedAt: {
    type: Date,
    default: Date.now(),
  },
  price: {
    type: Number,
    required: [true, "Booking must have a price"],
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
});
bookingSchema.pre(/^find/, function (next) {
  this.populate({ path: "tour", select: "name" });
  next();
});
const Booking = model("Booking", bookingSchema);
module.exports = Booking;
