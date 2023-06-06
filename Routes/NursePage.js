const express = require("express");
const router = express.Router();
const NurseController = require("../Controller/NurseController");
const { jwtMiddleware } = require("../utils/JWTHandler");
const { InsertAnAppointment } = require("../Controller/bookingCotroller");

router.post("/nurse-login", NurseController.login);
router.post("/verify-otp", NurseController.verifyOTP);
router.post("/resend-otp", NurseController.resendOTP);
router.get("/nurse-dashboard", jwtMiddleware, NurseController.dashboard);
router.get("/change-doctor", jwtMiddleware, NurseController.changeDoctor);
router.get("/change-dateRange", jwtMiddleware, NurseController.changeDateRange);
router.get(
  "/appointments-ThatDay",
  jwtMiddleware,
  NurseController.confirmedAppointmentsThatDay
);
router.get(
  "/search-appointment",
  jwtMiddleware,
  NurseController.searchAppointments
);
router.post(
  "/update-status",
  jwtMiddleware,
  NurseController.updateAppointmentStatus
);
router.post(
  "/notify-patientForToday",
  jwtMiddleware,
  NurseController.notifyPatientsForTodayThatDoctorHasArrived
);

router.post(
  "/notify-doctorForToday",
  jwtMiddleware,
  NurseController.notifyDoctorOnTodaysAppointment
);
router.post(
  "/add-doctorAvailability",
  jwtMiddleware,
  NurseController.addDoctorAvailability
);

router.post("/update-nurse", jwtMiddleware, NurseController.updateNurse);

router.get(
  "/avail-schedule-forUpdate",
  jwtMiddleware,
  NurseController.getAvailableScheduleForUpdate
);

router.post("/update-availability", NurseController.updateDoctorAvailability);

router.post(
  "/delete-availability",
  jwtMiddleware,
  NurseController.deleteDoctorAvailability
);

router.get(
  "/doctorScheduleForInsertAppointment",
  jwtMiddleware,
  NurseController.doctorScheduleForInsertAppointment
);

router.post("/insertAppointment", jwtMiddleware, InsertAnAppointment);
module.exports = router;
