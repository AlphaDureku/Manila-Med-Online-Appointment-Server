const express = require("express");
const router = express.Router();

//Controllers
const userController = require("../Controller/UserController");
const bookingController = require("../Controller/bookingCotroller");

router.get("/send-otp", bookingController.sendOTP);
router.get("/verifyOTP", bookingController.verifyOTP);
router.get("/doctor-calendar", bookingController.getOneDoctorCalendar);
router.get("/booking-conflict", bookingController.checkConflict);
router.post("/update-info", bookingController.updatePatientInfo);
router.get("/get-patientInfo", bookingController.getOnePatientDetails);
router.post("/set-appointment", bookingController.setAppointment);
router.get("/get-appointment", bookingController.getAppointmentDetails);
module.exports = router;
