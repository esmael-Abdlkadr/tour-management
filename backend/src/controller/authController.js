const User = require("../model/userModel");
const asyncHandler = require("../util/asyncHandler");
const appError = require("../util/appError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const sendEmail = require("../util/email");
const logActivity = require("../util/logActivity");
let cryptoRandomString;
import("crypto-random-string").then((module) => {
  cryptoRandomString = module.default;
});

//sign token.
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
//signup-user.
exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
    otp: cryptoRandomString({ length: 6, type: "numeric" }),
    otpExpires: Date.now() + 10 * 60 * 1000,
  });
  const data = {
    user: { name: newUser.name, email: newUser.email },
    otp: newUser.otp,
  };
  await sendEmail({ email: newUser.email, template: "activation.ejs", data });
  const token = signToken(newUser._id);
  // log use activity when user signup.
  logActivity(newUser._id, `new user signup ${name}`);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});
// verify token.
exports.verifyToken = asyncHandler(async (req, res, next) => {
  const { otp } = req.body;
  const user = await User.findOne({ otp, otpExpires: { $gt: Date.now() } });
  if (!user) {
    return next(new appError("Invalid or expired OTP", 400));
  }
  user.otp = undefined;
  user.otpExpires = undefined;
  user.emailVerified = true;
  await user.save({ validateBeforeSave: false });
  // send welcome email.
  const data = {
    user: { name: user.name, email: user.email },
    supportEmail: "support@destatouring.com",
  };
  await sendEmail({ email: user.email, template: "welcome.ejs", data });
  res.status(200).json({
    status: "success",
    message: "Email verified successfully",
  });
});
// request new otp.
exports.requestNewOtp = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new appError("there is no user with this email", 404));
  }
  // check if user otp is    till valid.
  // if (user.otpExpires > Date.now()) {
  //   return next(new appError("OTP is still valid", 400));
  // }
  // generate newq  otp.
  user.otp = cryptoRandomString({ length: 6, type: "numeric" });
  user.otpExpires = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });
  // send otp to user.
  const data = {
    user: { name: user.name, email: user.email },
    otp: user.otp,
  };
  await sendEmail({ email: user.email, template: "otpAgain.ejs", data });
  res.status(200).json({
    status: "sucess",
    message: "new OTP has been sent to your email",
  });
});
//login user.
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError("Please provide email and password!", 400));
  }
  const user = await User.findOne({ email }).select("+password +active");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError("Incorrect email or password", 401));
  }
  if (!user.active) {
    return next(
      new appError(
        "Your account is deactivated. Please reactivate your account to login",
        401
      )
    );
  }
  if (!user.emailVerified) {
    return res.status(200).json({
      status: "success",
      message:
        "Logged in successfully, but your email is not verified. Please verify your email.",
      token: signToken(user._id),
    });
  }
  res.status(200).json({
    status: "success",
    token: signToken(user._id),
  });
});
exports.protect = asyncHandler(async (req, res, next) => {
  // 1. Getting tokens and checking if it's there.
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // // If no token is found, return an error.
  if (!token) {
    return next(
      new appError("You are not logged in! Please log in to get access.", 401)
    );
  }
  // // Verify the token.
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // check if the user is still exist.
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new appError("The user belonging to this token  no longer exist.", 401)
    );
  }
  req.user = currentUser;
  next();
});

exports.restrcitedTo = function (...roles) {
  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
//forgot password.
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1. Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new appError("There is no user with email address", 404));
  }
  // 2. generate the random reset token.
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  console.log("user", user);
  // 3. Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetPassword/${resetToken}`;
  const data = {
    user: { name: user.name, email: user.email },
    resetURL,
    supportEmail: "support@destatouring.com",
  };
  try {
    await sendEmail({ email: user.email, template: "resetPassword.ejs", data });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new appError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
  res.status(200).json({
    status: "success",
    message: "Token sent to email!",
  });
});
//reset password. TODO ---not tested from backend (tested after  integrated with  client side)
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //1.get user based on token.
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //2.if token has not expired, and there is user, set the new password.
  if (!user) {
    return next(new appError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // send EMail  .  TODO
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});
//update password.
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new appError("Your current password is wrong", 401));
  }
  //if so, update password.
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  // check if the new password is the same as the old  one if os throw error.
  if (req.body.password === req.body.passwordCurrent) {
    return next(
      new appError("New password can't be the same as the old password", 400)
    );
  }
  await user.save();
  //.log user in, send JWT.
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
    token,
  });
});
// TODO--logout not  tested(will be test with client side integration)
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};
//update user.
exports.updateMe = asyncHandler(async (req, res, next) => {
  //1.create error if user posts password data.
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new appError(
        "This route is not for password updates. Please use /updateMyPassword",
        400
      )
    );
  }
  //2.update user document.

  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: {
      user: updatedUser,
    },
  });
});
//delete user.
exports.deleteMe = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  // log he activity.
  logActivity(req.user._id, "user delete their account");
  res.status(204).json({
    status: "success",
    data: null,
  });
});
// reactivate-deleted account.(if  it is in lessthan 30 days).
exports.reactivateAccount = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || user.active) {
    return next(
      new appError("There is no inactive user with this email address", 404)
    );
  }
  user.active = true;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message: "Account reactivated successfully",
  });
});

// my-info.
exports.myInfo = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
