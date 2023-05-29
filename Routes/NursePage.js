const express = require("express");
const router = express.Router();
const NurseController = require("../Controller/NurseController");
const { jwtMiddleware } = require("../utils/JWTHandler");

router.post("/nurse-login", NurseController.login);
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
  NurseController.notifyPatientsForToday
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

router.post("/update-password", jwtMiddleware, NurseController.updatePassword);

module.exports = router;
