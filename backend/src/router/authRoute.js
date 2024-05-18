const authController = require("../controller/authController");
const express = require("express");
const router = express.Router();
router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/verifyotp").post(authController.verifyToken);
router.route("/forgotpassword").post(authController.forgotPassword);
router.route("/resetpassword/:token").patch(authController.resetPassword);
router.use(authController.protect);
router.route("/update-password").patch(authController.updatePassword);

module.exports = router