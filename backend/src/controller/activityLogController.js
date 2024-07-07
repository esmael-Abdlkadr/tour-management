const ActivityLog = require("../model/activitiyLogModel");
const asyncHandler = require("../util/asyncHandler");
exports.getAllActivityLog = asyncHandler(async (req, res, next) => {
  const log = await ActivityLog.find()
    .populate({
      path: "user",
      select: "name email",
    })
    .populate({ path: "tour", select: "name" });
  res.status(200).json({
    status: "success",
    result: log.length,
    data: log,
  });
});
