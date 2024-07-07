const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const activityLogSchema = Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User",
    required: [true, "activitiy log must  have user   name"],
  },
  tour: {
    type: Schema.ObjectId,
    ref: "Tour",
  },
  action: { type: String, required: true },
  timeStamp: { type: Date, default: Date.now },
});
const ActivityLog = model(" ActivityLog", activityLogSchema);
module.exports = ActivityLog;
