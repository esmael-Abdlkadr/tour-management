const activityLog = require("../model/activitiyLogModel");
const asyncHandler = require("./asyncHandler");

const logActivity = asyncHandler(async (user, action) => {
  console.log(`Logging activity for user: ${user}, action: ${action}`); // Debugging log
  try {
    await activityLog.create({ user, action });
  } catch (error) {
    console.error("Error logging activity:", error); // Error log
    throw error; // Rethrow the error to be caught by asyncHandler
  }
});

module.exports = logActivity;
