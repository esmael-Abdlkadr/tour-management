const authController = require("../controller/authController");
const activityLogController = require("../controller/activityLogController");
const express = require("express");
const router = express.Router();

router.use(authController.protect, authController.restrcitedTo("admin"));
router.route("/").get(activityLogController.getAllActivityLog);
module.exports = router;
