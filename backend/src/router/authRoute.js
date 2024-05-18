const authController = require("../controller/authController");
const express = require("express");
const router = express.Router();
router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/verifyotp").post(authController.verifyToken);

router.use(authController.protect)

module.exports = router