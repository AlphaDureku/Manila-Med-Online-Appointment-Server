const express = require("express");
const router = express.Router();
//Controllers
const userController = require("../Controller/UserController");
const { jwtMiddleware } = require("../utils/JWTHandler");

router.get("/get-patients", jwtMiddleware, userController.getUser_Patients);
router.get(
  "/get-appointments",
  jwtMiddleware,
  userController.fetchPatient_Appointments_Using_Patient_ID
);
router.get(
  "/get-info",
  jwtMiddleware,
  userController.fetchPatientInfo_Using_Patient_ID
);
router.post("/edit-patient", jwtMiddleware, userController.updatePatientInfo);
router.post(
  "/cancel-appointment",
  jwtMiddleware,
  userController.cancelAppointment
);

module.exports = router;
