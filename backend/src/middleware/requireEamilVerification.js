const appError = require("../util/appError");
const asyncHandler = require("../util/asyncHandler");

// check email verification status.(middleware).
exports.requireEamilVerification = asyncHandler(async (req, res, next) => {
  if (!req.user.emailVerified) {
    return next(
      new appError(
        "Your email is not verified. Please verify your email to proceed",
        403
      )
    );
  }
  next();
});
