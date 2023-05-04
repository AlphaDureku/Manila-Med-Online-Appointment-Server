const express = require("express");
const router = express.Router();

//Controllers
const userController = require("../Controller/UserController");
const bookingController = require("../Controller/bookingCotroller");

router.get("/send-otp", bookingController.sendOTP);
router.get("/verifyOTP", bookingController.verifyOTP);
router.get("/doctor-calendar", bookingController.getOneDoctorCalendar);

module.exports = router;
