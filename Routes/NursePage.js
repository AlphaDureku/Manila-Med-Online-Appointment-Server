const express = require("express");
const router = express.Router();
const NurseController = require("../Controller/NurseController");
const jwtMiddleware = require("../utils/JWTHandler");

router.post("/nurse-login", NurseController.login);
router.get("/nurse-dashboard", jwtMiddleware, NurseController.dashboard);
router.get("/change-doctor", jwtMiddleware, NurseController.changeDoctor);
router.get("/change-dateRange", jwtMiddleware, NurseController.changeDateRange);
router.get(
  "/appointments-withdate",
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
router.post("/notify-patient", jwtMiddleware, NurseController.notifyPatients);

module.exports = router;
